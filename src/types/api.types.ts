// API-Football response types (from api.labenditaec.com)

export interface ApiResponse<T> {
  get: string
  parameters: Record<string, string>
  errors: Record<string, string> | string[]
  results: number
  paging: { current: number; total: number }
  response: T
}

// --- Fixtures ---
export interface ApiFixture {
  fixture: {
    id: number
    referee: string | null
    timezone: string
    date: string
    timestamp: number
    periods: { first: number | null; second: number | null }
    venue: { id: number | null; name: string; city: string }
    status: { long: string; short: string; elapsed: number | null }
  }
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string | null
    season: number
    round: string
  }
  teams: {
    home: ApiTeamShort
    away: ApiTeamShort
  }
  goals: { home: number | null; away: number | null }
  score: {
    halftime: { home: number | null; away: number | null }
    fulltime: { home: number | null; away: number | null }
    extratime: { home: number | null; away: number | null }
    penalty: { home: number | null; away: number | null }
  }
}

export interface ApiTeamShort {
  id: number
  name: string
  logo: string
  winner: boolean | null
}

// --- Teams ---
export interface ApiTeamResponse {
  team: {
    id: number
    name: string
    code: string | null
    country: string
    founded: number | null
    national: boolean
    logo: string
  }
  venue: {
    id: number
    name: string
    address: string
    city: string
    capacity: number
    surface: string
    image: string
  } | null
}

// --- Standings ---
export interface ApiStandingGroup {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string | null
    season: number
    standings: ApiStandingRow[][]
  }
}

export interface ApiStandingRow {
  rank: number
  team: { id: number; name: string; logo: string }
  points: number
  goalsDiff: number
  group: string
  form: string | null
  status: string
  description: string | null
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  home: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  away: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } }
  update: string
}

// --- Top Scorers / Assists / Cards ---
export interface ApiTopPlayer {
  player: {
    id: number
    name: string
    firstname: string
    lastname: string
    age: number
    birth: { date: string; place: string; country: string }
    nationality: string
    height: string | null
    weight: string | null
    injured: boolean
    photo: string
  }
  statistics: ApiPlayerStat[]
}

export interface ApiPlayerStat {
  team: { id: number; name: string; logo: string }
  league: { id: number; name: string; country: string; logo: string; flag: string | null; season: number }
  games: { appearences: number; lineups: number; minutes: number; number: number | null; position: string; rating: string | null; captain: boolean }
  substitutes: { in: number; out: number; bench: number }
  shots: { total: number | null; on: number | null }
  goals: { total: number | null; conceded: number | null; assists: number | null; saves: number | null }
  passes: { total: number | null; key: number | null; accuracy: number | null }
  tackles: { total: number | null; blocks: number | null; interceptions: number | null }
  duels: { total: number | null; won: number | null }
  dribbles: { attempts: number | null; success: number | null; past: number | null }
  fouls: { drawn: number | null; committed: number | null }
  cards: { yellow: number; yellowred: number; red: number }
  penalty: { won: number | null; commited: number | null; scored: number | null; missed: number | null; saved: number | null }
}

// --- Lineups ---
export interface ApiLineup {
  team: { id: number; name: string; logo: string; colors: any }
  coach: { id: number; name: string; photo: string }
  formation: string
  startXI: { player: { id: number; name: string; number: number; pos: string; grid: string | null; photo?: string } }[]
  substitutes: { player: { id: number; name: string; number: number; pos: string; grid: string | null; photo?: string } }[]
}

// --- Events ---
export interface ApiEvent {
  time: { elapsed: number; extra: number | null }
  team: { id: number; name: string; logo: string }
  player: { id: number; name: string }
  assist: { id: number | null; name: string | null }
  type: string
  detail: string
  comments: string | null
}

// --- Players ---
export interface ApiPlayerResponse {
  player: {
    id: number
    name: string
    firstname: string
    lastname: string
    age: number
    birth: { date: string; place: string; country: string }
    nationality: string
    height: string | null
    weight: string | null
    injured: boolean
    photo: string
  }
  statistics: ApiPlayerStat[]
}

// --- Predictions ---
export interface ApiPrediction {
  predictions: {
    winner: { id: number; name: string; comment: string } | null
    win_or_draw: boolean
    under_over: string | null
    goals: { home: string; away: string }
    advice: string
    percent: { home: string; draw: string; away: string }
  }
  league: { id: number; name: string; country: string; logo: string; flag: string | null; season: number }
  teams: {
    home: { id: number; name: string; logo: string; last_5: any; league: any }
    away: { id: number; name: string; logo: string; last_5: any; league: any }
  }
  comparison: Record<string, { home: string; away: string }>
  h2h: ApiFixture[]
}

// --- Venues ---
export interface ApiVenue {
  id: number
  name: string
  address: string
  city: string
  country: string
  capacity: number
  surface: string
  image: string
}
