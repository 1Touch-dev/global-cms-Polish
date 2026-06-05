import { Spiel, SpielStatus, SpielTeam } from '@/types/spiel.types'
import { Team } from '@/types/team.types'
import { Spieler, Position } from '@/types/spieler.types'
import { ApiFixture, ApiTeamResponse, ApiTopPlayer, ApiStandingRow } from '@/types/api.types'

function mapFixtureStatus(status: string): SpielStatus {
  const statusMap: Record<string, SpielStatus> = {
    'NS': 'Geplant',
    'TBD': 'Geplant',
    '1H': 'Live',
    '2H': 'Live',
    'HT': 'Halbzeit',
    'ET': 'Live',
    'P': 'Live',
    'FT': 'Beendet',
    'AET': 'Beendet',
    'PEN': 'Beendet',
    'PST': 'Verschoben',
    'CANC': 'Verschoben',
    'ABD': 'Verschoben',
    'SUSP': 'Verschoben',
    'INT': 'Live',
    'LIVE': 'Live',
  }
  return statusMap[status] || 'Geplant'
}

function getCountryFlag(country: string): string {
  const flagMap: Record<string, string> = {
    'Germany': '🇩🇪', 'France': '🇫🇷', 'Brazil': '🇧🇷', 'Argentina': '🇦🇷',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Portugal': '🇵🇹',
    'Netherlands': '🇳🇱', 'Belgium': '🇧🇪', 'Croatia': '🇭🇷', 'Uruguay': '🇺🇾',
    'Mexico': '🇲🇽', 'USA': '🇺🇸', 'Canada': '🇨🇦', 'Japan': '🇯🇵',
    'South Korea': '🇰🇷', 'Australia': '🇦🇺', 'Saudi Arabia': '🇸🇦', 'Qatar': '🇶🇦',
    'Morocco': '🇲🇦', 'Senegal': '🇸🇳', 'Ghana': '🇬🇭', 'Cameroon': '🇨🇲',
    'Nigeria': '🇳🇬', 'Egypt': '🇪🇬', 'Tunisia': '🇹🇳', 'Algeria': '🇩🇿',
    'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Peru': '🇵🇪', 'Ecuador': '🇪🇨',
    'Paraguay': '🇵🇾', 'Bolivia': '🇧🇴', 'Venezuela': '🇻🇪',
    'Poland': '🇵🇱', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪', 'Norway': '🇳🇴',
    'Switzerland': '🇨🇭', 'Austria': '🇦🇹', 'Serbia': '🇷🇸', 'Turkey': '🇹🇷',
    'Ukraine': '🇺🇦', 'Czech Republic': '🇨🇿', 'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'Ireland': '🇮🇪', 'Costa Rica': '🇨🇷', 'Panama': '🇵🇦', 'Honduras': '🇭🇳',
    'Jamaica': '🇯🇲', 'Iran': '🇮🇷', 'China': '🇨🇳', 'India': '🇮🇳',
    'Russia': '🇷🇺', 'Greece': '🇬🇷', 'Romania': '🇷🇴', 'Hungary': '🇭🇺',
    'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Finland': '🇫🇮', 'Iceland': '🇮🇸',
    'Albania': '🇦🇱', 'North Macedonia': '🇲🇰', 'Montenegro': '🇲🇪',
    'Bosnia and Herzegovina': '🇧🇦', 'New Zealand': '🇳🇿', 'Ivory Coast': '🇨🇮',
  }
  return flagMap[country] || '🏳️'
}

function getTeamCode(name: string): string {
  const codeMap: Record<string, string> = {
    'Germany': 'GER', 'France': 'FRA', 'Brazil': 'BRA', 'Argentina': 'ARG',
    'England': 'ENG', 'Spain': 'ESP', 'Italy': 'ITA', 'Portugal': 'POR',
    'Netherlands': 'NED', 'Belgium': 'BEL', 'Croatia': 'CRO', 'Uruguay': 'URU',
    'Mexico': 'MEX', 'United States': 'USA', 'Canada': 'CAN', 'Japan': 'JPN',
    'South Korea': 'KOR', 'Australia': 'AUS', 'Saudi Arabia': 'KSA',
    'Morocco': 'MAR', 'Senegal': 'SEN', 'Colombia': 'COL',
  }
  return codeMap[name] || name.slice(0, 3).toUpperCase()
}

export function mapFixtureToSpiel(fixture: ApiFixture): Spiel {
  const date = new Date(fixture.fixture.date)

  const team1: SpielTeam = {
    id: fixture.teams.home.id,
    name: fixture.teams.home.name,
    kurzname: getTeamCode(fixture.teams.home.name),
    flagge: getCountryFlag(fixture.teams.home.name) || '⚽',
    wappen: fixture.teams.home.logo,
  }

  const team2: SpielTeam = {
    id: fixture.teams.away.id,
    name: fixture.teams.away.name,
    kurzname: getTeamCode(fixture.teams.away.name),
    flagge: getCountryFlag(fixture.teams.away.name) || '⚽',
    wappen: fixture.teams.away.logo,
  }

  return {
    id: fixture.fixture.id,
    datum: date.toISOString().split('T')[0],
    uhrzeit: date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' }),
    team1,
    team2,
    ergebnis: fixture.goals.home !== null ? {
      team1: fixture.goals.home,
      team2: fixture.goals.away ?? 0,
      halbzeit: fixture.score.halftime.home !== null ? {
        team1: fixture.score.halftime.home,
        team2: fixture.score.halftime.away ?? 0,
      } : undefined,
    } : undefined,
    stadion: fixture.fixture.venue.name || '',
    stadt: fixture.fixture.venue.city || '',
    gruppe: fixture.league.round,
    status: mapFixtureStatus(fixture.fixture.status.short),
    schiedsrichter: fixture.fixture.referee || undefined,
  }
}

export function mapApiTeamToTeam(apiTeam: ApiTeamResponse, gruppe?: string): Team {
  return {
    id: apiTeam.team.id,
    name: apiTeam.team.name,
    kurzname: apiTeam.team.code || apiTeam.team.name.slice(0, 3).toUpperCase(),
    code: (apiTeam.team.code || apiTeam.team.name.slice(0, 3)).toLowerCase(),
    flagge: getCountryFlag(apiTeam.team.country),
    wappen: apiTeam.team.logo,
    land: apiTeam.team.country,
    kontinent: '',
    fifaRanking: 0,
    trainer: '',
    gruppe,
    stadion: apiTeam.venue?.name,
    stadionBild: apiTeam.venue?.image || undefined,
    stadionKapazitaet: apiTeam.venue?.capacity || undefined,
    gruendung: apiTeam.team.founded || undefined,
  }
}

function mapPosition(pos: string): Position {
  const posMap: Record<string, Position> = {
    'Goalkeeper': 'Torwart',
    'Defender': 'Abwehr',
    'Midfielder': 'Mittelfeld',
    'Attacker': 'Sturm',
  }
  return posMap[pos] || 'Mittelfeld'
}

export function mapTopPlayerToSpieler(apiPlayer: ApiTopPlayer): Spieler {
  const stats = apiPlayer.statistics[0]
  return {
    id: apiPlayer.player.id,
    name: apiPlayer.player.name,
    nameDE: apiPlayer.player.name,
    nationalitaet: apiPlayer.player.nationality,
    position: mapPosition(stats?.games?.position || 'Attacker'),
    geburtsdatum: apiPlayer.player.birth?.date || '',
    groesse: parseInt(apiPlayer.player.height || '0') || 0,
    verein: stats?.team?.name || '',
    vereinLogo: stats?.team?.logo || '',
    trikotNummer: stats?.games?.number || 0,
    bild: apiPlayer.player.photo,
    statistiken: {
      tore: stats?.goals?.total || 0,
      vorlagen: stats?.goals?.assists || 0,
      spiele: stats?.games?.appearences || 0,
      gelbeKarten: stats?.cards?.yellow || 0,
      roteKarten: stats?.cards?.red || 0,
      schuesse: stats?.shots?.total || 0,
      passquote: stats?.passes?.accuracy || 0,
      zweikampfquote: stats?.duels?.total ? Math.round(((stats.duels.won || 0) / stats.duels.total) * 100) : 0,
    },
  }
}

export function mapStandingToGruppe(standings: ApiStandingRow[][]) {
  return standings.map((group) => {
    const groupName = group[0]?.group?.replace('Group ', '') || ''
    return {
      name: groupName,
      teams: group.map((row) => ({
        id: row.team.id,
        name: row.team.name,
        kurzname: getTeamCode(row.team.name),
        flagge: getCountryFlag(row.team.name),
        wappen: row.team.logo,
        spiele: row.all.played,
        siege: row.all.win,
        unentschieden: row.all.draw,
        niederlagen: row.all.lose,
        tore: row.all.goals.for,
        gegentore: row.all.goals.against,
        tordifferenz: row.goalsDiff,
        punkte: row.points,
        form: (row.form || '').split('').map((f: string): 'S' | 'U' | 'N' => {
          if (f === 'W') return 'S'
          if (f === 'D') return 'U'
          return 'N'
        }),
      })),
    }
  })
}
