import type { ApiFixture, ApiResponse } from '@/types/api.types'
import { getFixtures } from './footballApi'

const WM_LEAGUE_ID = process.env.WM_LEAGUE_ID || '1'
const WM_SEASON = process.env.WM_SEASON || '2026'
const FALLBACK_DATE = '2026-06-11T19:00:00Z'

export interface WorldCupMatchHeroData {
  id: number
  date: string
  venue: string
  location: string
  round: string
  tournament: string
  homeTeam: {
    name: string
    shortName: string
    logo?: string
  }
  awayTeam: {
    name: string
    shortName: string
    logo?: string
  }
}

function shortName(name: string) {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 1) return name.slice(0, 3).toUpperCase()
  return parts.map((part) => part[0]).join('').slice(0, 3).toUpperCase()
}

function mapFixture(fixture: ApiFixture): WorldCupMatchHeroData {
  return {
    id: fixture.fixture.id,
    date: fixture.fixture.date,
    venue: fixture.fixture.venue?.name || 'TBD',
    location: fixture.fixture.venue?.city || '',
    round: fixture.league?.round || 'World Cup 2026',
    tournament: fixture.league?.name || 'FIFA World Cup 2026',
    homeTeam: {
      name: fixture.teams.home.name,
      shortName: shortName(fixture.teams.home.name),
      logo: fixture.teams.home.logo || undefined,
    },
    awayTeam: {
      name: fixture.teams.away.name,
      shortName: shortName(fixture.teams.away.name),
      logo: fixture.teams.away.logo || undefined,
    },
  }
}

export function fallbackWorldCupMatch(): WorldCupMatchHeroData {
  return {
    id: 0,
    date: FALLBACK_DATE,
    venue: 'Estadio Azteca',
    location: 'Mexico City',
    round: 'Opening Match',
    tournament: 'FIFA World Cup 2026',
    homeTeam: { name: 'TBD', shortName: 'TBD' },
    awayTeam: { name: 'TBD', shortName: 'TBD' },
  }
}

export async function fetchNextWorldCupMatch() {
  const response = await getFixtures({ league: WM_LEAGUE_ID, season: WM_SEASON, next: '20' })
  const fixtures = (response as ApiResponse<ApiFixture[]> | null)?.response || []
  const now = Date.now()

  const nextFixture = fixtures
    .filter((fixture) => fixture.fixture?.timestamp * 1000 > now)
    .sort((a, b) => a.fixture.timestamp - b.fixture.timestamp)[0]

  return nextFixture ? mapFixture(nextFixture) : fallbackWorldCupMatch()
}
