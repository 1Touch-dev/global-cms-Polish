import {
  getFixtures,
  getTopScorers,
  getTopAssists,
  getTopCards,
  getStandings,
  getTeams,
  getLiveMatches,
  getLiveMatchesByLeague,
  getMatchDetails,
  getLineups,
  getMatchEvents,
  getFixtureStats,
  getPlayersByTeam,
  getPlayerSquads,
  getPlayerStatistics,
  searchPlayers,
  getPredictions,
  getHeadToHead,
} from './footballApi'
import { Gruppe, KORundeSpiel } from '@/types/wm.types'
import { ApiResponse, ApiFixture, ApiTopPlayer, ApiStandingGroup, ApiTeamResponse } from '@/types/api.types'
import { mapFixtureToSpiel, mapTopPlayerToSpieler, mapApiTeamToTeam, mapStandingToGruppe } from './dataTransformers'
import { Spiel } from '@/types/spiel.types'
import { Team } from '@/types/team.types'
import { Spieler } from '@/types/spieler.types'

const WM_LEAGUE_ID = process.env.WM_LEAGUE_ID || '1'
const WM_SEASON = process.env.WM_SEASON || '2026'

// --- Homepage Data ---
export async function getHomepageData() {
  const [fixturesRes, topScorersRes, standingsRes, liveRes] = await Promise.all([
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '6' }),
    getTopScorers({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getStandings({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getLiveMatchesByLeague(WM_LEAGUE_ID),
  ])

  const fixtures = fixturesRes as ApiResponse<ApiFixture[]> | null
  const topScorers = topScorersRes as ApiResponse<ApiTopPlayer[]> | null
  const standings = standingsRes as ApiResponse<ApiStandingGroup[]> | null
  const live = liveRes as ApiResponse<ApiFixture[]> | null

  const liveSpiele: Spiel[] = (live?.response || []).map(mapFixtureToSpiel)
  const upcomingSpiele: Spiel[] = (fixtures?.response || []).map(mapFixtureToSpiel)
  const aktuelleSpiele = liveSpiele.length > 0 ? liveSpiele.slice(0, 3) : upcomingSpiele.slice(0, 3)

  const scorers = (topScorers?.response || []).slice(0, 5).map((p, i) => {
    const stats = p.statistics[0]
    return {
      rang: i + 1,
      name: p.player.name,
      flagge: '',
      nationalitaet: p.player.nationality,
      verein: stats?.team?.name || '',
      vereinLogo: stats?.team?.logo || '',
      tore: stats?.goals?.total || 0,
      photo: p.player.photo,
    }
  })

  const gruppen = standings?.response?.[0]
    ? mapStandingToGruppe(standings.response[0].league.standings)
    : []

  return { aktuelleSpiele, scorers, gruppen }
}

// --- Spiele Page Data ---
export async function getSpielePageData() {
  const [upcomingRes, pastRes, liveRes] = await Promise.all([
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '10' }),
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, last: '10' }),
    getLiveMatchesByLeague(WM_LEAGUE_ID),
  ])

  const upcoming = upcomingRes as ApiResponse<ApiFixture[]> | null
  const past = pastRes as ApiResponse<ApiFixture[]> | null
  const live = liveRes as ApiResponse<ApiFixture[]> | null

  const liveSpiele: Spiel[] = (live?.response || []).map(mapFixtureToSpiel)
  const upcomingSpiele: Spiel[] = (upcoming?.response || []).map(mapFixtureToSpiel)
  const pastSpiele: Spiel[] = (past?.response || []).map(mapFixtureToSpiel)

  return { liveSpiele, upcomingSpiele, pastSpiele }
}

// --- Teams Page Data ---
export async function getTeamsPageData() {
  const [teamsRes, standingsRes, fixturesRes] = await Promise.all([
    getTeams({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getStandings({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '80' }),
  ])

  const teamsData = teamsRes as ApiResponse<ApiTeamResponse[]> | null
  const standingsData = standingsRes as ApiResponse<ApiStandingGroup[]> | null
  const fixturesData = fixturesRes as ApiResponse<ApiFixture[]> | null

  let teams: Team[] = (teamsData?.response || []).map((t) => mapApiTeamToTeam(t))

  const gruppen = standingsData?.response?.[0]
    ? mapStandingToGruppe(standingsData.response[0].league.standings)
    : []

  if (teams.length === 0 && gruppen.length > 0) {
    teams = gruppen.flatMap((gruppe) =>
      gruppe.teams.map((team) => ({
        id: team.id,
        name: team.name,
        kurzname: team.kurzname,
        code: team.kurzname.toLowerCase(),
        flagge: team.flagge,
        wappen: team.wappen || '',
        land: team.name,
        kontinent: '',
        fifaRanking: 0,
        trainer: '',
        gruppe: gruppe.name,
      })),
    )
  }

  if (teams.length === 0) {
    const uniqueTeams = new Map<number, Team>()
    ;(fixturesData?.response || []).forEach((fixture) => {
      ;[fixture.teams.home, fixture.teams.away].forEach((team) => {
        if (!team?.id || uniqueTeams.has(team.id)) return
        const kurzname = team.name.slice(0, 3).toUpperCase()
        uniqueTeams.set(team.id, {
          id: team.id,
          name: team.name,
          kurzname,
          code: kurzname.toLowerCase(),
          flagge: '',
          wappen: team.logo || '',
          land: team.name,
          kontinent: '',
          fifaRanking: 0,
          trainer: '',
        })
      })
    })
    teams = Array.from(uniqueTeams.values())
  }

  // Assign groups to teams
  gruppen.forEach((g) => {
    g.teams.forEach((gt) => {
      const team = teams.find((t) => t.id === gt.id)
      if (team) team.gruppe = g.name
    })
  })

  return { teams, gruppen }
}

// --- Top Scorers Page Data ---
export async function getTorschuetzenPageData() {
  const res = await getTopScorers({ league: WM_LEAGUE_ID, season: WM_SEASON })
  const data = res as ApiResponse<ApiTopPlayer[]> | null

  const torschuetzen = (data?.response || []).map((p, i) => {
    const stats = p.statistics[0]
    const goals = stats?.goals?.total || 0
    const appearances = stats?.games?.appearences || 1
    const minutes = stats?.games?.minutes || 0
    const shots = stats?.shots?.total || 0

    return {
      rang: i + 1,
      name: p.player.name,
      photo: p.player.photo,
      nationalitaet: p.player.nationality,
      verein: stats?.team?.name || '',
      vereinLogo: stats?.team?.logo || '',
      position: stats?.games?.position || '',
      tore: goals,
      vorlagen: stats?.goals?.assists || 0,
      spiele: appearances,
      minutenProTor: goals > 0 ? Math.round(minutes / goals) : 0,
      schuesse: shots,
      trefferquote: shots > 0 ? Math.round((goals / shots) * 100) : 0,
      elfmeter: stats?.penalty?.scored || 0,
    }
  })

  return { torschuetzen }
}

// --- Statistiken Page Data ---
export async function getStatistikenPageData() {
  const [scorersRes, assistsRes, cardsRes] = await Promise.all([
    getTopScorers({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getTopAssists({ league: WM_LEAGUE_ID, season: WM_SEASON }),
    getTopCards({ league: WM_LEAGUE_ID, season: WM_SEASON }),
  ])

  const scorers = scorersRes as ApiResponse<ApiTopPlayer[]> | null
  const assists = assistsRes as ApiResponse<ApiTopPlayer[]> | null
  const cards = cardsRes as ApiResponse<ApiTopPlayer[]> | null

  const topScorerData = (scorers?.response || []).slice(0, 7).map((p) => ({
    name: p.player.name.split(' ').pop() || p.player.name,
    value: p.statistics[0]?.goals?.total || 0,
    fullName: p.player.name,
    photo: p.player.photo,
  }))

  const topAssistData = (assists?.response || []).slice(0, 7).map((p) => ({
    name: p.player.name.split(' ').pop() || p.player.name,
    value: p.statistics[0]?.goals?.assists || 0,
    fullName: p.player.name,
    photo: p.player.photo,
  }))

  const topCardsData = (cards?.response || []).slice(0, 7).map((p) => ({
    name: p.player.name.split(' ').pop() || p.player.name,
    value: (p.statistics[0]?.cards?.yellow || 0) + (p.statistics[0]?.cards?.red || 0),
    yellow: p.statistics[0]?.cards?.yellow || 0,
    red: p.statistics[0]?.cards?.red || 0,
    fullName: p.player.name,
    photo: p.player.photo,
  }))

  return { topScorerData, topAssistData, topCardsData }
}

// --- Spieler Page Data ---
export async function getSpielerPageData() {
  const res = await getTopScorers({ league: WM_LEAGUE_ID, season: WM_SEASON })
  const data = res as ApiResponse<ApiTopPlayer[]> | null

  const spieler: Spieler[] = (data?.response || []).slice(0, 20).map(mapTopPlayerToSpieler)

  return { spieler }
}

// --- Single Match Data ---
export async function getMatchPageData(matchId: string) {
  const [matchRes, eventsRes, statsRes, lineupsRes] = await Promise.all([
    getMatchDetails(matchId),
    getMatchEvents(matchId),
    getFixtureStats(matchId),
    getLineups(matchId),
  ])

  const matchFixture = (matchRes as any)?.response?.[0]
  const h2hKey = matchFixture?.teams?.home?.id && matchFixture?.teams?.away?.id
    ? `${matchFixture.teams.home.id}-${matchFixture.teams.away.id}`
    : null

  const h2hRes = h2hKey ? await getHeadToHead(h2hKey) : null

  return {
    match: matchRes,
    events: eventsRes,
    stats: statsRes,
    lineups: lineupsRes,
    h2h: h2hRes,
  }
}

// --- Team Detail Data ---
export async function getTeamDetailData(teamId: string) {
  const [teamRes, fixturesRes, squadRes] = await Promise.all([
    getTeams({ team: teamId, season: WM_SEASON }),
    getFixtures({ team: teamId, season: WM_SEASON, league: WM_LEAGUE_ID }),
    getPlayerSquads(teamId),
  ])

  const teamData = teamRes as ApiResponse<ApiTeamResponse[]> | null
  const fixturesData = fixturesRes as ApiResponse<ApiFixture[]> | null

  const team = teamData?.response?.[0] ? mapApiTeamToTeam(teamData.response[0]) : null
  const spiele: Spiel[] = (fixturesData?.response || []).map(mapFixtureToSpiel)

  return { team, spiele, squad: squadRes }
}

// --- Player Detail Data ---
export async function getPlayerDetailData(playerId: string) {
  const res = await getPlayerStatistics({ player: playerId, season: WM_SEASON, league: WM_LEAGUE_ID })
  return res
}

// --- Liga config ---
export const LIGA_CONFIG: Record<string, {
  apiId: string
  season: string
  name: string
  flag: string
  zones: { typ: string; von: number; bis: number; farbe: string; label: string }[]
}> = {
  'bundesliga': {
    apiId: '78', season: '2024', name: 'Bundesliga', flag: '🇩🇪',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Meister' },
      { typ: 'champions_league', von: 2, bis: 4, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
      { typ: 'europa_league', von: 5, bis: 5, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
      { typ: 'conference_league', von: 6, bis: 6, farbe: 'rgba(0,180,100,0.1)', label: 'Conference League' },
      { typ: 'relegation', von: 16, bis: 16, farbe: 'rgba(255,165,0,0.15)', label: 'Relegation' },
      { typ: 'abstieg', von: 17, bis: 18, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
    ],
  },
  'champions-league': {
    apiId: '2', season: '2024', name: 'Champions League', flag: '🇪🇺',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 8, farbe: 'rgba(0,80,200,0.15)', label: 'Achtelfinale direkt' },
      { typ: 'europa_league', von: 9, bis: 24, farbe: 'rgba(255,204,0,0.10)', label: 'Play-off' },
      { typ: 'abstieg', von: 25, bis: 36, farbe: 'rgba(221,0,0,0.15)', label: 'Ausgeschieden' },
    ],
  },
  'premier-league': {
    apiId: '39', season: '2024', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Champion' },
      { typ: 'champions_league', von: 2, bis: 4, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
      { typ: 'europa_league', von: 5, bis: 5, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
      { typ: 'conference_league', von: 6, bis: 6, farbe: 'rgba(0,180,100,0.1)', label: 'Conference League' },
      { typ: 'abstieg', von: 18, bis: 20, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
    ],
  },
  'la-liga': {
    apiId: '140', season: '2024', name: 'La Liga', flag: '🇪🇸',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Meister' },
      { typ: 'champions_league', von: 2, bis: 4, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
      { typ: 'europa_league', von: 5, bis: 6, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
      { typ: 'abstieg', von: 18, bis: 20, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
    ],
  },
  'serie-a': {
    apiId: '135', season: '2024', name: 'Serie A', flag: '🇮🇹',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Meister' },
      { typ: 'champions_league', von: 2, bis: 4, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
      { typ: 'europa_league', von: 5, bis: 6, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
      { typ: 'abstieg', von: 18, bis: 20, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
    ],
  },
  'ligue-1': {
    apiId: '61', season: '2024', name: 'Ligue 1', flag: '🇫🇷',
    zones: [
      { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Meister' },
      { typ: 'champions_league', von: 2, bis: 3, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
      { typ: 'europa_league', von: 4, bis: 5, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
      { typ: 'abstieg', von: 16, bis: 18, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
    ],
  },
}

// --- Liga Page Data ---
export async function getLigaPageData(ligaSlug: string) {
  const config = LIGA_CONFIG[ligaSlug]
  if (!config) return null

  const [standingsRes, scorersRes, fixturesRes] = await Promise.all([
    getStandings({ league: config.apiId, season: config.season }),
    getTopScorers({ league: config.apiId, season: config.season }),
    getFixtures({ league: config.apiId, season: config.season, last: '6' }),
  ])

  const standingsData = standingsRes as ApiResponse<ApiStandingGroup[]> | null
  const scorersData = scorersRes as ApiResponse<ApiTopPlayer[]> | null
  const fixturesData = fixturesRes as ApiResponse<ApiFixture[]> | null

  // Map standings to LigaTabellePlatz format
  const rawStandings = standingsData?.response?.[0]?.league?.standings?.[0] || []
  const tabelle = rawStandings.map((row: any) => ({
    rang: row.rank,
    team: {
      id: row.team.id,
      name: row.team.name,
      wappen: row.team.logo || '',
    },
    spiele: row.all.played,
    siege: row.all.win,
    unentschieden: row.all.draw,
    niederlagen: row.all.lose,
    tore: row.all.goals.for,
    gegentore: row.all.goals.against,
    tordifferenz: row.goalsDiff,
    punkte: row.points,
    form: (row.form || '').split('').slice(-5).map((f: string) =>
      f === 'W' ? 'S' : f === 'D' ? 'U' : f === 'L' ? 'N' : f
    ) as ('S' | 'U' | 'N')[],
  }))

  // Map top scorers
  const topScorer = (scorersData?.response || []).slice(0, 10).map((p, i) => {
    const stats = p.statistics[0]
    return {
      rang: i + 1,
      name: p.player.name,
      photo: p.player.photo,
      nationalitaet: p.player.nationality,
      verein: stats?.team?.name || '',
      vereinLogo: stats?.team?.logo || '',
      tore: stats?.goals?.total || 0,
      vorlagen: stats?.goals?.assists || 0,
      spiele: stats?.games?.appearences || 0,
    }
  })

  // Map recent fixtures
  const recentFixtures: Spiel[] = (fixturesData?.response || []).map(mapFixtureToSpiel)

  // League info from API
  const leagueInfo = standingsData?.response?.[0]?.league
  const ligaLogo = leagueInfo?.logo || ''
  const saison = leagueInfo?.season?.toString() || config.season

  return {
    config,
    tabelle,
    topScorer,
    recentFixtures,
    ligaLogo,
    saison,
  }
}

// --- WM 2026 Gruppen (Standings) ---
export async function getWMGruppenData(): Promise<Gruppe[]> {
  const standingsRes = await getStandings({ league: WM_LEAGUE_ID, season: WM_SEASON })
  const standings = standingsRes as ApiResponse<ApiStandingGroup[]> | null

  if (!standings?.response?.[0]) return []

  return mapStandingToGruppe(standings.response[0].league.standings)
}

// --- WM 2026 Ergebnisse (Past Fixtures) ---
export async function getWMErgebnisseData() {
  const res = await getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, last: '50' })
  const data = res as ApiResponse<ApiFixture[]> | null
  return (data?.response || []).map(mapFixtureToSpiel)
}

// --- WM 2026 Spielplan (All / Upcoming Fixtures) ---
export async function getWMSpielplanData() {
  const [liveRes, upcomingRes, pastRes] = await Promise.all([
    getLiveMatchesByLeague(WM_LEAGUE_ID),
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '60' }),
    getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, last: '20' }),
  ])
  const live = liveRes as ApiResponse<ApiFixture[]> | null
  const upcoming = upcomingRes as ApiResponse<ApiFixture[]> | null
  const past = pastRes as ApiResponse<ApiFixture[]> | null

  const liveSpiele = (live?.response || []).map(mapFixtureToSpiel)
  const upcomingSpiele = (upcoming?.response || []).map(mapFixtureToSpiel)
  const pastSpiele = (past?.response || []).map(mapFixtureToSpiel)

  const byId = new Map<number, Spiel>()
  ;[...liveSpiele, ...pastSpiele, ...upcomingSpiele].forEach((spiel) => byId.set(spiel.id, spiel))

  return Array.from(byId.values())
}

// --- WM 2026 KO-Runde (Bracket) ---
export async function getWMBracketData(): Promise<KORundeSpiel[]> {
  const res = await getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON })
  const data = res as ApiResponse<ApiFixture[]> | null

  const koRunden = ['Round of 16', 'Quarter-finals', 'Semi-finals', '3rd Place Final', 'Final',
    'Achtelfinale', 'Viertelfinale', 'Halbfinale', '3rd place', 'Finale']

  const fixtures = (data?.response || []).filter((f: ApiFixture) =>
    koRunden.some(r => f.league?.round?.toLowerCase().includes(r.toLowerCase()))
  )

  return fixtures.map((f: ApiFixture, i: number): KORundeSpiel => {
    const roundName = f.league?.round || ''
    let runde: KORundeSpiel['runde'] = 'Achtelfinale'
    if (/final/i.test(roundName) && !/semi|quarter|3rd/i.test(roundName)) runde = 'Finale'
    else if (/semi/i.test(roundName)) runde = 'Halbfinale'
    else if (/quarter/i.test(roundName)) runde = 'Viertelfinale'
    else if (/3rd|third/i.test(roundName)) runde = 'Finale'

    const isFinished = f.fixture?.status?.short === 'FT' || f.fixture?.status?.short === 'AET' || f.fixture?.status?.short === 'PEN'

    return {
      id: f.fixture?.id || i + 49,
      runde,
      team1: f.teams?.home?.name || null,
      team2: f.teams?.away?.name || null,
      ergebnis: isFinished ? { team1: f.goals?.home ?? 0, team2: f.goals?.away ?? 0 } : undefined,
      datum: f.fixture?.date ? f.fixture.date.split('T')[0] : '',
      stadion: f.fixture?.venue?.name || '',
    }
  })
}

// --- WM 2026 Upcoming Fixtures for Vorhersage ---
export async function getWMVorhersageSpiele() {
  const res = await getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '10' })
  const data = res as ApiResponse<ApiFixture[]> | null

  return (data?.response || []).slice(0, 8).map((f: ApiFixture) => ({
    id: f.fixture?.id,
    team1: { name: f.teams?.home?.name || '', flagge: '', kurzname: f.teams?.home?.name?.slice(0, 3).toUpperCase() || '' },
    team2: { name: f.teams?.away?.name || '', flagge: '', kurzname: f.teams?.away?.name?.slice(0, 3).toUpperCase() || '' },
    gruppe: f.league?.round || '',
    datum: f.fixture?.date ? f.fixture.date : '',
    uhrzeit: f.fixture?.date ? f.fixture.date : '',
    stadion: f.fixture?.venue?.name || '',
  }))
}

// --- Team Detail Page Data (real squad + fixtures + standing) ---
export async function getTeamDetailPageData(teamId: string) {
  const season = WM_SEASON

  const [teamRes, fixturesRes, squadRes, standingsRes] = await Promise.all([
    getTeams({ team: teamId, season }),
    getFixtures({ team: teamId, season, league: WM_LEAGUE_ID }),
    getPlayerSquads(teamId),
    getStandings({ league: WM_LEAGUE_ID, season }),
  ])

  const teamData = teamRes as ApiResponse<ApiTeamResponse[]> | null
  const fixturesData = fixturesRes as ApiResponse<ApiFixture[]> | null
  const standingsData = standingsRes as ApiResponse<ApiStandingGroup[]> | null

  const team = teamData?.response?.[0] ? mapApiTeamToTeam(teamData.response[0]) : null
  const spiele: Spiel[] = (fixturesData?.response || []).map(mapFixtureToSpiel)

  // Find team standing from WM groups
  let standingRow: any = null
  let gruppe = ''
  const allGroups = standingsData?.response?.[0]?.league?.standings || []
  for (const group of allGroups) {
    const found = group.find((r: any) => r.team.id === Number(teamId))
    if (found) {
      standingRow = found
      gruppe = found.group?.replace('Group ', '') || ''
      break
    }
  }

  // Squad grouped by position
  const squadRaw = (squadRes as any)?.response?.[0]?.players || []
  const kader: Record<string, { id: number; nr: number; name: string; alter: number; photo: string; position: string }[]> = {}
  const posMap: Record<string, string> = {
    Goalkeeper: 'Torwart', Defender: 'Abwehr', Midfielder: 'Mittelfeld', Attacker: 'Sturm',
  }
  for (const p of squadRaw) {
    const pos = posMap[p.position] || p.position || 'Unbekannt'
    if (!kader[pos]) kader[pos] = []
    kader[pos].push({
      id: p.id,
      nr: p.number || 0,
      name: p.name,
      alter: p.age || 0,
      photo: p.photo || '',
      position: p.position || '',
    })
  }

  return {
    team,
    spiele,
    kader,
    standingRow,
    gruppe,
    squad: squadRes,
  }
}
