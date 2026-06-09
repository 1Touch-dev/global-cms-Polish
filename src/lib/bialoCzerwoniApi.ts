// ─────────────────────────────────────────────────────────────────────────────
// bialoCzerwoni.live  ×  Headless CMS API client
// ─────────────────────────────────────────────────────────────────────────────

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:4000/api'

export const BIALO_CZERWONI_WEBSITE = 'bialoczerwoni.live'

// ── Endpoint constants (CMS names — verbatim, including spaces) ────────────
export const BC_ENDPOINTS = {
  HomePage: 'HomePage',
  Wc2026: 'WC 2026',
  Wc2026Groups: 'WC 2026 Groups',
  Wc2026Schedule: 'WC 2026 Schedule',
  Wc2026KnockoutStage: 'WC 2026 Knockout Stage',
  PolandNationalTeam: 'Poland National Team',
  Transfers: 'Transfers',
  Players: 'Players',
  Stadiums: 'Stadiums',
  Scorers: 'Scorers',
  Other: 'Other',
} as const

export type BcEndpointKey = keyof typeof BC_ENDPOINTS
export type BcEndpointName = (typeof BC_ENDPOINTS)[BcEndpointKey]

/** Next.js route → CMS endpoint mapping */
export const BialoCzerwoniRouteEndpoint: Record<string, BcEndpointName> = {
  '/': BC_ENDPOINTS.HomePage,
  '/ms-2026': BC_ENDPOINTS.Wc2026,
  '/ms-2026/grupy': BC_ENDPOINTS.Wc2026Groups,
  '/ms-2026/terminarz': BC_ENDPOINTS.Wc2026Schedule,
  '/ms-2026/faza-pucharowa': BC_ENDPOINTS.Wc2026KnockoutStage,
  '/reprezentacja': BC_ENDPOINTS.PolandNationalTeam,
  '/transfery': BC_ENDPOINTS.Transfers,
  '/zawodnicy': BC_ENDPOINTS.Players,
  '/stadiony': BC_ENDPOINTS.Stadiums,
  '/strzelcy': BC_ENDPOINTS.Scorers,
  '/inne': BC_ENDPOINTS.Other,
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BialoCzerwoniArticle {
  _id: string
  title: string
  slug: string
  summary: string
  description: string
  content: string // HTML
  category: string[]
  tags?: string[]
  countryName?: string[]
  imageUrls: string[]
  coverImage?: string
  targetWebsites: string[]
  endpointAssignments?: { name: string }[]
  createdAt: string
  updatedAt: string
}

export interface BcListMeta {
  total: number
  currentPage: number
  totalPages: number
  limit: number
}

export interface BcListResponse {
  data: BialoCzerwoniArticle[]
  meta: BcListMeta
}

/** Returns `coverImage` when available, otherwise first imageUrls entry. */
export function bcThumbnail(article: BialoCzerwoniArticle): string | undefined {
  return article.coverImage || article.imageUrls?.[0]
}

// ── List query options ─────────────────────────────────────────────────────

export interface BcListOptions {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  requireImage?: boolean
  search?: string
  daysBack?: number
}

// ── Internal fetch helper ─────────────────────────────────────────────────

async function bcFetch<T>(
  path: string,
  searchParams: Record<string, string | number | boolean>,
  revalidate = 60,
): Promise<T | null> {
  const url = new URL(`${CMS_BASE}${path}`)
  Object.entries(searchParams).forEach(([k, v]) => {
    url.searchParams.set(k, String(v))
  })

  try {
    const res = await fetch(url.toString(), { next: { revalidate } })
    if (!res.ok) {
      console.error(`[BialoCzerwoni CMS] ${res.status} ${res.statusText} — ${url}`)
      return null
    }
    return res.json() as Promise<T>
  } catch (err) {
    console.error('[BialoCzerwoni CMS] fetch error:', err)
    return null
  }
}

// ── Public API functions ──────────────────────────────────────────────────

/**
 * Generic list fetcher. ALWAYS sends targetWebsite + filterByEndpoint=true.
 */
export async function fetchBialoCzerwoniArticlesByEndpoint(
  endpoint: BcEndpointName,
  {
    page = 1,
    limit = 20,
    sort = 'createdAt',
    order = 'desc',
    requireImage,
    search,
    daysBack,
  }: BcListOptions = {},
): Promise<BcListResponse | null> {
  const params: Record<string, string | number | boolean> = {
    targetWebsite: BIALO_CZERWONI_WEBSITE,
    endpoint,
    filterByEndpoint: true,
    page,
    limit,
    sort,
    order,
  }
  if (requireImage !== undefined) params.requireImage = requireImage
  if (search) params.search = search
  if (daysBack !== undefined) params.daysBack = daysBack

  return bcFetch<BcListResponse>('/ai-articles', params)
}

/** Home page — 9 articles from HomePage endpoint. */
export async function fetchBialoCzerwoniHomePage(
  limit = 9,
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.HomePage, {
    limit,
    page: 1,
  })
}

/** WC 2026 section — paginated. */
export async function fetchBialoCzerwoniWc2026(
  page = 1,
  limit = 20,
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Wc2026, { page, limit })
}

/** Reprezentacja Polski section — paginated. */
export async function fetchBialoCzerwoniPolandNationalTeam(
  page = 1,
  limit = 20,
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.PolandNationalTeam, {
    page,
    limit,
  })
}

/** Transfery section — paginated. */
export async function fetchBialoCzerwoniTransfers(
  page = 1,
  limit = 20,
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Transfers, { page, limit })
}

/** Fetch a single article by slug. */
export async function fetchBialoCzerwoniArticleBySlug(
  slug: string,
): Promise<BialoCzerwoniArticle | null> {
  return bcFetch<BialoCzerwoniArticle>(`/ai-articles/slug/${encodeURIComponent(slug)}`, {})
}

// ── Polish date formatter ─────────────────────────────────────────────────

export function formatDatePl(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' },
): string {
  try {
    return new Intl.DateTimeFormat('pl-PL', options).format(new Date(dateString))
  } catch {
    return dateString
  }
}
