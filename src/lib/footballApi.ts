const API_BASE = process.env.FOOTBALL_CMS_API_BASE || 'https://api.labenditaec.com/api/football'

interface FetchOptions {
  revalidate?: number
  params?: Record<string, string>
}

async function fetchFromApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
  const { revalidate = 300, params } = options
  const url = new URL(`${API_BASE}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate },
    })

    if (!res.ok) {
      console.error(`Football API Error [${endpoint}]: ${res.status} ${res.statusText}`)
      return null
    }

    return res.json()
  } catch (error) {
    console.error(`Football API Fetch Error [${endpoint}]:`, error)
    return null
  }
}

// --- Leagues ---
export async function getLeagues(params?: { season?: string; country?: string; type?: string }) {
  return fetchFromApi<any>('/leagues', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Teams ---
export async function getTeams(params: { league?: string; season?: string; team?: string }) {
  return fetchFromApi<any>('/teams', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Standings ---
export async function getStandings(params: { league: string; season: string }) {
  return fetchFromApi<any>('/standings', {
    params: params as Record<string, string>,
    revalidate: 300,
  })
}

// --- Fixtures ---
export async function getFixtures(params: {
  league?: string
  season?: string
  team?: string
  next?: string
  last?: string
  live?: string
}) {
  return fetchFromApi<any>('/fixtures', {
    params: params as Record<string, string>,
    revalidate: 60,
  })
}

// --- Live Matches ---
export async function getLiveMatches() {
  return fetchFromApi<any>('/live', { revalidate: 30 })
}

// --- Match Details ---
export async function getMatchDetails(matchId: string) {
  return fetchFromApi<any>(`/match/${matchId}`, { revalidate: 60 })
}

// --- Lineups ---
export async function getLineups(fixtureId: string) {
  return fetchFromApi<any>('/lineups', {
    params: { fixture: fixtureId },
    revalidate: 300,
  })
}

// --- Match Events ---
export async function getMatchEvents(fixtureId: string) {
  return fetchFromApi<any>('/events', {
    params: { fixture: fixtureId },
    revalidate: 60,
  })
}

// --- Fixture Stats ---
export async function getFixtureStats(fixtureId: string) {
  return fetchFromApi<any>('/stats', {
    params: { fixture: fixtureId },
    revalidate: 300,
  })
}

// --- Players by Team ---
export async function getPlayersByTeam(params: { team: string; season: string }) {
  return fetchFromApi<any>('/players', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Player Search ---
export async function searchPlayers(searchTerm: string) {
  return fetchFromApi<any>('/players', {
    params: { search: searchTerm },
    revalidate: 600,
  })
}

// --- Player Squads ---
export async function getPlayerSquads(teamId: string) {
  return fetchFromApi<any>('/players-squads', {
    params: { team: teamId },
    revalidate: 3600,
  })
}

// --- Player Statistics ---
export async function getPlayerStatistics(params: { player: string; season: string; league: string }) {
  return fetchFromApi<any>('/players-statistics', {
    params: params as Record<string, string>,
    revalidate: 600,
  })
}

// Fetch player stats by ID only — tries /players endpoint with multiple seasons
export async function fetchPlayerById(playerId: string) {
  // Try /players endpoint (returns basic info + stats across all clubs)
  // Season 2026 for WM, fallback to 2025/2024 for club stats
  const seasons = ['2026', '2025', '2024']

  for (const season of seasons) {
    const res = await fetchFromApi<any>('/players', {
      params: { id: playerId, season },
      revalidate: 0,
    }) as any

    if (res?.response?.length) return res
  }

  return null
}

// --- Player Performance (Per Match) ---
export async function getPlayerPerformance(fixtureId: string) {
  return fetchFromApi<any>('/players-performance', {
    params: { fixture: fixtureId },
    revalidate: 300,
  })
}

// --- Top Scorers ---
export async function getTopScorers(params: { league: string; season: string }) {
  return fetchFromApi<any>('/topscorers', {
    params: params as Record<string, string>,
    revalidate: 300,
  })
}

// --- Top Assists ---
export async function getTopAssists(params: { league: string; season: string }) {
  return fetchFromApi<any>('/topassists', {
    params: params as Record<string, string>,
    revalidate: 300,
  })
}

// --- Top Cards ---
export async function getTopCards(params: { league: string; season: string; type?: string }) {
  return fetchFromApi<any>('/topcards', {
    params: params as Record<string, string>,
    revalidate: 300,
  })
}

// --- Predictions ---
export async function getPredictions(fixtureId: string) {
  return fetchFromApi<any>('/predictions', {
    params: { fixture: fixtureId },
    revalidate: 600,
  })
}

// --- Odds ---
export async function getOdds(params: { fixture: string; bookmaker?: string }) {
  return fetchFromApi<any>('/odds', {
    params: params as Record<string, string>,
    revalidate: 600,
  })
}

// --- Coach ---
export async function searchCoach(searchTerm: string) {
  return fetchFromApi<any>('/coach', {
    params: { search: searchTerm },
    revalidate: 3600,
  })
}

// --- Sidelined ---
export async function getSidelined(teamId: string) {
  return fetchFromApi<any>('/sidelined', {
    params: { team: teamId },
    revalidate: 600,
  })
}

// --- Injuries ---
export async function getInjuries(params: { team: string; season: string }) {
  return fetchFromApi<any>('/injuries', {
    params: params as Record<string, string>,
    revalidate: 600,
  })
}

// --- Head to Head ---
export async function getHeadToHead(h2h: string) {
  return fetchFromApi<any>('/headtohead', {
    params: { h2h },
    revalidate: 3600,
  })
}

// --- Transfers ---
export async function getTransfers(params: { player?: string; team?: string }) {
  return fetchFromApi<any>('/footbal/transfers', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Trophies ---
export async function getTrophies(params: { player?: string; team?: string }) {
  return fetchFromApi<any>('/trophies', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Rounds ---
export async function getRounds(params: { league: string; season: string }) {
  return fetchFromApi<any>('/rounds', {
    params: params as Record<string, string>,
    revalidate: 3600,
  })
}

// --- Venues ---
export async function getVenues(params: { country?: string }) {
  return fetchFromApi<any>('/venues', {
    params: params as Record<string, string>,
    revalidate: 86400,
  })
}

// --- Countries ---
export async function getCountries() {
  return fetchFromApi<any>('/countries', { revalidate: 86400 })
}

// --- Seasons ---
export async function getSeasons() {
  return fetchFromApi<any>('/seasons', { revalidate: 86400 })
}

// --- Bookmakers ---
export async function getBookmakers() {
  return fetchFromApi<any>('/bookmakers', { revalidate: 86400 })
}

// --- Bets ---
export async function getBets() {
  return fetchFromApi<any>('/bets', { revalidate: 3600 })
}
