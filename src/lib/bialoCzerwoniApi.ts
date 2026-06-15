// ─────────────────────────────────────────────────────────────────────────────
// bialoCzerwoni.live  ×  Headless CMS API client
// ─────────────────────────────────────────────────────────────────────────────

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL || 'https://api.golazopro.com/api'
const TRANSLATE_REVALIDATE_SECONDS = 60 * 60 * 24 * 7
const TRANSLATE_CHUNK_SIZE = 3500

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
export const BC_ENDPOINT_VALUES = Object.values(BC_ENDPOINTS)

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

export interface BialoCzerwoniAuthor {
  name?: string
  displayName?: string
  username?: string
  image?: string
  avatar?: string
}

export interface BialoCzerwoniSeo {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
}

export interface BialoCzerwoniArticleTranslation {
  locale?: string
  language?: string
  lang?: string
  title?: string
  summary?: string
  description?: string
  content?: string
  seoTitle?: string
  seoDescription?: string
  metaTitle?: string
  metaDescription?: string
  tags?: string[]
}

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
  author?: string | BialoCzerwoniAuthor
  authorName?: string
  publishedAt?: string
  videoUrl?: string
  videoURL?: string
  videoUrls?: string[]
  youtubeUrl?: string
  twitterUrl?: string
  xUrl?: string
  tweetUrl?: string
  socialLinks?: {
    twitter?: string
    x?: string
    facebook?: string
  }
  seo?: BialoCzerwoniSeo
  seoTitle?: string
  seoDescription?: string
  metaTitle?: string
  metaDescription?: string
  translatedVersions?: BialoCzerwoniArticleTranslation[]
  createdAt: string
  updatedAt: string
}

export interface BcResolvedArticle {
  title: string
  summary: string
  description: string
  content: string
  seoTitle: string
  seoDescription: string
  tags: string[]
  authorName: string
  publishedAt: string
  videoUrl?: string
  twitterUrl?: string
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
  category?: string
  daysBack?: number
  locale?: string
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

async function bcFetchListWithFallback(
  searchParams: Record<string, string | number | boolean>,
  locale?: string,
) {
  const targeted = await bcFetch<BcListResponse>('/ai-articles', searchParams)
  if (targeted?.data?.length) return translateBcListFallback(targeted, locale)

  const siteFallbackParams = { ...searchParams }
  delete siteFallbackParams.endpoint
  delete siteFallbackParams.filterByEndpoint
  const siteScoped = await bcFetch<BcListResponse>('/ai-articles', siteFallbackParams)
  if (siteScoped?.data?.length) return translateBcListFallback(siteScoped, locale)

  const fallbackParams = { ...searchParams }
  delete fallbackParams.targetWebsite
  return translateBcListFallback(await bcFetch<BcListResponse>('/ai-articles', fallbackParams), locale)
}

function normalizeBcArticle(payload: unknown): BialoCzerwoniArticle | null {
  if (!payload) return null
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    return normalizeBcArticle((payload as { data?: unknown }).data)
  }
  if (typeof payload === 'object' && payload !== null && 'article' in payload) {
    return normalizeBcArticle((payload as { article?: unknown }).article)
  }
  return payload as BialoCzerwoniArticle
}

async function fetchBialoCzerwoniSiteArticles(
  page = 1,
  limit = 20,
  { sort = 'createdAt', order = 'desc', requireImage, search, category, daysBack, locale }: BcListOptions = {},
): Promise<BcListResponse | null> {
  const params: Record<string, string | number | boolean> = {
    targetWebsite: BIALO_CZERWONI_WEBSITE,
    page,
    limit,
    sort,
    order,
  }
  if (requireImage !== undefined) params.requireImage = requireImage
  if (search) params.search = search
  if (category) params.category = category
  if (daysBack !== undefined) params.daysBack = daysBack

  return translateBcListFallback(await bcFetch<BcListResponse>('/ai-articles', params), locale)
}

export async function fetchBialoCzerwoniNewsPage(
  page = 1,
  limit = 20,
  options: BcListOptions = {},
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniSiteArticles(page, limit, options)
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
    category,
    daysBack,
    locale,
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
  if (category) params.category = category
  if (daysBack !== undefined) params.daysBack = daysBack

  return bcFetchListWithFallback(params, locale)
}

export async function fetchBialoCzerwoniArticlesByCategory(
  category: string,
  options: BcListOptions = {},
): Promise<BcListResponse | null> {
  return fetchBialoCzerwoniNewsPage(options.page ?? 1, options.limit ?? 20, {
    ...options,
    category,
  })
}

/** Home page — 9 articles from HomePage endpoint. */
export async function fetchBialoCzerwoniHomePage(
  limit = 9,
  locale?: string,
): Promise<BcListResponse | null> {
  const homepage = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.HomePage, {
    limit,
    page: 1,
    locale,
  })
  if (homepage?.data?.length) return homepage

  return fetchBialoCzerwoniSiteArticles(1, limit, { locale })
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
  locale?: string,
): Promise<BialoCzerwoniArticle | null> {
  const targeted = normalizeBcArticle(await bcFetch<unknown>(
    `/ai-articles/slug/${encodeURIComponent(slug)}`,
    { targetWebsite: BIALO_CZERWONI_WEBSITE },
  ))
  if (targeted) return translateBcArticleFallback(targeted, locale, true)

  return translateBcArticleFallback(
    normalizeBcArticle(await bcFetch<unknown>(`/ai-articles/slug/${encodeURIComponent(slug)}`, {})),
    locale,
    true,
  )
}

export function bcArticleEndpointNames(article: BialoCzerwoniArticle): string[] {
  return article.endpointAssignments
    ?.map((endpoint) => endpoint.name)
    .filter(Boolean) ?? []
}

export function bcPrimaryCategory(article: BialoCzerwoniArticle): string {
  return bcArticleEndpointNames(article)[0] || article.category?.[0] || 'News'
}

function findTranslation(
  article: BialoCzerwoniArticle,
  locale = 'pl',
): BialoCzerwoniArticleTranslation | undefined {
  const normalizedLocale = locale.toLowerCase()

  return article.translatedVersions?.find((version) => {
    const versionLocale = (version.locale || version.language || version.lang || '').toLowerCase()
    return versionLocale === normalizedLocale || versionLocale.startsWith(`${normalizedLocale}-`)
  })
}

function getTranslatedText(payload: unknown): string {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return ''
  return payload[0]
    .map((segment) => (Array.isArray(segment) && typeof segment[0] === 'string' ? segment[0] : ''))
    .join('')
}

function splitTranslationChunks(text: string): string[] {
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > TRANSLATE_CHUNK_SIZE) {
    const splitAt = Math.max(
      remaining.lastIndexOf(' ', TRANSLATE_CHUNK_SIZE),
      remaining.lastIndexOf('\n', TRANSLATE_CHUNK_SIZE),
    )
    const end = splitAt > 0 ? splitAt + 1 : TRANSLATE_CHUNK_SIZE
    chunks.push(remaining.slice(0, end))
    remaining = remaining.slice(end)
  }

  if (remaining) chunks.push(remaining)
  return chunks
}

async function translateTextToEnglish(text?: string) {
  if (!text?.trim()) return text

  const translated = await Promise.all(
    splitTranslationChunks(text).map(async (chunk) => {
      const url = new URL('https://translate.googleapis.com/translate_a/single')
      url.searchParams.set('client', 'gtx')
      url.searchParams.set('sl', 'auto')
      url.searchParams.set('tl', 'en')
      url.searchParams.set('dt', 't')
      url.searchParams.set('q', chunk)

      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        next: { revalidate: TRANSLATE_REVALIDATE_SECONDS },
      }).catch(() => null)

      if (!res?.ok) return chunk
      return getTranslatedText(await res.json()) || chunk
    }),
  )

  return translated.join('').trim() || text
}

async function translateBcArticleFallback(article: BialoCzerwoniArticle, locale?: string, translateContent?: boolean): Promise<BialoCzerwoniArticle>
async function translateBcArticleFallback(article: null, locale?: string, translateContent?: boolean): Promise<null>
async function translateBcArticleFallback(article: BialoCzerwoniArticle | null, locale?: string, translateContent?: boolean): Promise<BialoCzerwoniArticle | null>
async function translateBcArticleFallback(article: BialoCzerwoniArticle | null, locale?: string, translateContent = false): Promise<BialoCzerwoniArticle | null> {
  if (!article || locale !== 'en' || findTranslation(article, 'en')) return article

  const [title, summary, description, content, seoTitle, seoDescription] = await Promise.all([
    translateTextToEnglish(article.title),
    translateTextToEnglish(article.summary),
    translateTextToEnglish(article.description),
    translateContent ? translateTextToEnglish(article.content) : Promise.resolve(article.content),
    translateTextToEnglish(article.seoTitle || article.metaTitle || article.seo?.title),
    translateTextToEnglish(article.seoDescription || article.metaDescription || article.seo?.description),
  ])

  return {
    ...article,
    title: title || article.title,
    summary: summary || article.summary,
    description: description || article.description,
    content: content || article.content,
    seoTitle: seoTitle || article.seoTitle,
    seoDescription: seoDescription || article.seoDescription,
    metaTitle: seoTitle || article.metaTitle,
    metaDescription: seoDescription || article.metaDescription,
    seo: {
      ...article.seo,
      title: seoTitle || article.seo?.title,
      description: seoDescription || article.seo?.description,
    },
  }
}

async function translateBcListFallback(response: BcListResponse | null, locale?: string) {
  if (!response || locale !== 'en') return response
  return {
    ...response,
    data: await Promise.all(response.data.map((article) => translateBcArticleFallback(article, locale))),
  }
}

function firstText(...values: Array<string | undefined | null>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim() || ''
}

function firstOptionalText(...values: Array<string | undefined | null>) {
  return values.find((value) => typeof value === 'string' && value.trim().length > 0)?.trim()
}

function resolveAuthorName(article: BialoCzerwoniArticle) {
  if (typeof article.author === 'string') return article.author
  return firstText(
    article.authorName,
    article.author?.displayName,
    article.author?.name,
    article.author?.username,
    'Biało-Czerwoni',
  )
}

export function resolveBcArticle(
  article: BialoCzerwoniArticle,
  locale = 'pl',
): BcResolvedArticle {
  const translation = findTranslation(article, locale)
  const title = firstText(translation?.title, article.title)
  const summary = firstText(translation?.summary, article.summary, article.description)
  const description = firstText(translation?.description, article.description, article.summary)
  const seoTitle = firstText(
    translation?.seoTitle,
    translation?.metaTitle,
    article.seoTitle,
    article.metaTitle,
    article.seo?.title,
    title,
  )
  const seoDescription = firstText(
    translation?.seoDescription,
    translation?.metaDescription,
    article.seoDescription,
    article.metaDescription,
    article.seo?.description,
    summary,
    description,
  )

  return {
    title,
    summary,
    description,
    content: firstText(translation?.content, article.content),
    seoTitle,
    seoDescription,
    tags: translation?.tags?.length ? translation.tags : article.tags ?? [],
    authorName: resolveAuthorName(article),
    publishedAt: article.publishedAt || article.createdAt,
    videoUrl: firstOptionalText(
      article.videoUrl,
      article.videoURL,
      article.youtubeUrl,
      article.videoUrls?.[0],
    ),
    twitterUrl: firstOptionalText(
      article.twitterUrl,
      article.xUrl,
      article.tweetUrl,
      article.socialLinks?.twitter,
      article.socialLinks?.x,
    ),
  }
}

export async function fetchBialoCzerwoniRelatedArticles(
  article: BialoCzerwoniArticle,
  { limit = 4 }: Pick<BcListOptions, 'limit'> = {},
): Promise<BialoCzerwoniArticle[]> {
  const endpoint = bcArticleEndpointNames(article).find((name): name is BcEndpointName =>
    BC_ENDPOINT_VALUES.includes(name as BcEndpointName),
  )

  const data = endpoint
    ? await fetchBialoCzerwoniArticlesByEndpoint(endpoint, { limit: limit + 1 })
    : await fetchBialoCzerwoniNewsPage(1, limit + 1, { category: article.category?.[0] })

  return (data?.data || [])
    .filter((related) => related.slug !== article.slug)
    .slice(0, limit)
}

export function bcArticleSearchText(article: BialoCzerwoniArticle): string {
  return [
    article.title,
    article.summary,
    article.description,
    article.content,
    article.category?.join(' '),
    article.tags?.join(' '),
    bcArticleEndpointNames(article).join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function filterArticlesMentioningTeams(
  articles: BialoCzerwoniArticle[],
  teamNames: string[],
): BialoCzerwoniArticle[] {
  const normalizedTeams = teamNames
    .map((team) => team.trim().toLowerCase())
    .filter(Boolean)

  if (normalizedTeams.length === 0) return articles

  return [...articles]
    .map((article) => {
      const text = bcArticleSearchText(article)
      const matches = normalizedTeams.filter((team) => text.includes(team)).length
      return { article, matches }
    })
    .filter(({ matches }) => matches > 0)
    .sort((a, b) => b.matches - a.matches)
    .map(({ article }) => article)
}

export async function fetchBialoCzerwoniArticlesMentioningTeams(
  teamNames: string[],
  limit = 6,
): Promise<BialoCzerwoniArticle[]> {
  const normalizedTeams = teamNames.map((team) => team.trim()).filter(Boolean)
  if (normalizedTeams.length === 0) return []

  const searches = [
    normalizedTeams.join(' '),
    ...normalizedTeams,
  ]

  const responses = await Promise.all(
    searches.map((search) =>
      fetchBialoCzerwoniNewsPage(1, 12, { search }).catch(() => null),
    ),
  )

  const bySlug = new Map<string, BialoCzerwoniArticle>()
  for (const response of responses) {
    for (const article of response?.data ?? []) {
      bySlug.set(article.slug, article)
    }
  }

  return filterArticlesMentioningTeams(Array.from(bySlug.values()), normalizedTeams)
    .slice(0, limit)
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
