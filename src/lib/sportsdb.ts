/**
 * Server-side only — never import this in client components.
 * TheSportsDB key stays on the server. Football live/standings remain on API-Football.
 */

export interface SportLeague {
  id: string
  name: string
  sport: string
  country: string
  badge: string | null
  rss: string | null
}

export interface SportTeam {
  id: string
  name: string
  badge: string | null
  leagueId: string | null
}

export interface SportEvent {
  id: string
  name: string
  date: string
  time: string | null
  home: string | null
  away: string | null
  league: string | null
  leagueId: string | null
  status: string | null
  thumb: string | null
}

export interface SportsProfile {
  country: string
  sport: string
  seedLeagueIds: string[]
  nameNeedles: string[]
}

export const POLAND_VOLLEYBALL_PROFILE: SportsProfile = {
  country: 'Poland',
  sport: 'Volleyball',
  seedLeagueIds: ['5619'], // PlusLiga
  nameNeedles: ['plusliga', 'poland', 'polish', 'siatkowka', 'siatkówka'],
}

const BASE_URL = process.env.SPORTSDB_BASE_URL ?? 'https://www.thesportsdb.com/api/v1/json'
const API_KEY = process.env.SPORTSDB_API_KEY ?? '123'
const TIMEOUT_MS = 8000
const CATALOG_REVALIDATE = 3600
const EVENTS_REVALIDATE = 300

const inflight = new Map<string, Promise<unknown>>()

interface RawLeague {
  idLeague?: string
  strLeague?: string
  strSport?: string
  strCountry?: string
  strBadge?: string
  strLogo?: string
  strRSS?: string
}

interface RawTeam {
  idTeam?: string
  strTeam?: string
  strBadge?: string
  idLeague?: string
}

interface RawEvent {
  idEvent?: string
  strEvent?: string
  dateEvent?: string
  strTime?: string
  strHomeTeam?: string
  strAwayTeam?: string
  strLeague?: string
  idLeague?: string
  strStatus?: string
  strThumb?: string
  strPoster?: string
}

function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inflight.get(key)
  if (existing) return existing as Promise<T>
  const p = fn().finally(() => inflight.delete(key))
  inflight.set(key, p)
  return p
}

async function tsdbFetch<T>(
  path: string,
  params: Record<string, string>,
  revalidate: number,
): Promise<T | null> {
  const url = new URL(`${BASE_URL}/${API_KEY}/${path}`)
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v)
  }
  const cacheKey = url.toString()

  return cached(cacheKey, async () => {
    try {
      const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
        next: { revalidate },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      })
      if (!res.ok) return null
      return (await res.json()) as T
    } catch {
      return null
    }
  })
}

function mapLeague(raw: RawLeague): SportLeague | null {
  if (!raw.idLeague || !raw.strLeague) return null
  return {
    id: String(raw.idLeague),
    name: raw.strLeague,
    sport: raw.strSport ?? '',
    country: raw.strCountry ?? '',
    badge: raw.strBadge || raw.strLogo || null,
    rss: raw.strRSS || null,
  }
}

function mapTeam(raw: RawTeam): SportTeam | null {
  if (!raw.idTeam || !raw.strTeam) return null
  return {
    id: String(raw.idTeam),
    name: raw.strTeam,
    badge: raw.strBadge || null,
    leagueId: raw.idLeague ? String(raw.idLeague) : null,
  }
}

function mapEvent(raw: RawEvent): SportEvent | null {
  if (!raw.idEvent) return null
  const name =
    raw.strEvent ||
    [raw.strHomeTeam, raw.strAwayTeam].filter(Boolean).join(' vs ') ||
    'Event'
  return {
    id: String(raw.idEvent),
    name,
    date: raw.dateEvent ?? '',
    time: raw.strTime || null,
    home: raw.strHomeTeam || null,
    away: raw.strAwayTeam || null,
    league: raw.strLeague || null,
    leagueId: raw.idLeague ? String(raw.idLeague) : null,
    status: raw.strStatus || null,
    thumb: raw.strThumb || raw.strPoster || null,
  }
}

function matchesNeedles(name: string, country: string, needles: string[]): boolean {
  const hay = `${name} ${country}`.toLowerCase()
  return needles.some((n) => hay.includes(n.toLowerCase()))
}

export function isAllowedSportsQuery(
  profile: SportsProfile,
  sport?: string | null,
  country?: string | null,
): boolean {
  const s = (sport ?? profile.sport).trim().toLowerCase()
  const c = (country ?? profile.country).trim().toLowerCase()
  if (s !== profile.sport.toLowerCase()) return false
  if (!c) return true
  return c === profile.country.toLowerCase()
}

export async function searchLeagues(country: string, sport: string): Promise<SportLeague[]> {
  const json = await tsdbFetch<{ countries?: RawLeague[]; leagues?: RawLeague[] }>(
    'search_all_leagues.php',
    { c: country, s: sport },
    CATALOG_REVALIDATE,
  )
  const rows = json?.countries ?? json?.leagues ?? []
  return rows.map(mapLeague).filter((x): x is SportLeague => Boolean(x))
}

export async function searchLeaguesBySport(sport: string): Promise<SportLeague[]> {
  const json = await tsdbFetch<{ countries?: RawLeague[]; leagues?: RawLeague[] }>(
    'search_all_leagues.php',
    { s: sport },
    CATALOG_REVALIDATE,
  )
  const rows = json?.countries ?? json?.leagues ?? []
  return rows.map(mapLeague).filter((x): x is SportLeague => Boolean(x))
}

export async function lookupLeague(leagueId: string): Promise<SportLeague | null> {
  const json = await tsdbFetch<{ leagues?: RawLeague[] }>(
    'lookupleague.php',
    { id: leagueId },
    CATALOG_REVALIDATE,
  )
  const raw = json?.leagues?.[0]
  return raw ? mapLeague(raw) : null
}

export async function lookupLeagueTeams(leagueId: string): Promise<SportTeam[]> {
  const json = await tsdbFetch<{ teams?: RawTeam[] }>(
    'lookup_all_teams.php',
    { id: leagueId },
    CATALOG_REVALIDATE,
  )
  return (json?.teams ?? []).map(mapTeam).filter((x): x is SportTeam => Boolean(x))
}

export async function searchTeams(country: string, sport: string): Promise<SportTeam[]> {
  const json = await tsdbFetch<{ teams?: RawTeam[] }>(
    'search_all_teams.php',
    { c: country, s: sport },
    CATALOG_REVALIDATE,
  )
  return (json?.teams ?? []).map(mapTeam).filter((x): x is SportTeam => Boolean(x))
}

export async function nextLeagueEvents(leagueId: string): Promise<SportEvent[]> {
  const json = await tsdbFetch<{ events?: RawEvent[] }>(
    'eventsnextleague.php',
    { id: leagueId },
    EVENTS_REVALIDATE,
  )
  return (json?.events ?? []).map(mapEvent).filter((x): x is SportEvent => Boolean(x))
}

export async function eventsOnDate(date: string, sport: string): Promise<SportEvent[]> {
  const json = await tsdbFetch<{ events?: RawEvent[] }>(
    'eventsday.php',
    { d: date, s: sport },
    EVENTS_REVALIDATE,
  )
  return (json?.events ?? []).map(mapEvent).filter((x): x is SportEvent => Boolean(x))
}

export async function resolveLeagues(profile: SportsProfile): Promise<SportLeague[]> {
  const primary = await searchLeagues(profile.country, profile.sport)
  if (primary.length > 0) return primary

  const bySport = await searchLeaguesBySport(profile.sport)
  const filtered = bySport.filter((league) =>
    matchesNeedles(league.name, league.country, [...profile.nameNeedles, profile.country]),
  )
  if (filtered.length > 0) return filtered

  const seeded: SportLeague[] = []
  for (const id of profile.seedLeagueIds) {
    const league = await lookupLeague(id)
    if (league) seeded.push(league)
  }
  return seeded
}

export interface SportHomeData {
  leagues: SportLeague[]
  events: SportEvent[]
  primary: SportLeague | null
}

export async function getProfileHomeData(profile: SportsProfile): Promise<SportHomeData> {
  const leagues = await resolveLeagues(profile)
  const primary =
    leagues.find((l) => profile.seedLeagueIds.includes(l.id)) ?? leagues[0] ?? null
  const events = primary ? (await nextLeagueEvents(primary.id)).slice(0, 8) : []
  return {
    leagues: leagues.slice(0, 12),
    events,
    primary,
  }
}

export function getPolandVolleyballHomeData(): Promise<SportHomeData> {
  return getProfileHomeData(POLAND_VOLLEYBALL_PROFILE)
}

export async function getLeagueHub(leagueId: string): Promise<{
  league: SportLeague | null
  events: SportEvent[]
  teams: SportTeam[]
}> {
  const [league, events, teams] = await Promise.all([
    lookupLeague(leagueId),
    nextLeagueEvents(leagueId),
    lookupLeagueTeams(leagueId),
  ])
  return { league, events: events.slice(0, 20), teams: teams.slice(0, 40) }
}
