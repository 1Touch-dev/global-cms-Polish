/**
 * IndexNow Backfill Script
 * ─────────────────────────────────────────────────────────────────────────────
 * Submits all known URLs from the sitemap to IndexNow.
 * Idempotent — safe to run multiple times (IndexNow deduplicates server-side).
 *
 * Usage:
 *   npx tsx scripts/indexnow-backfill.ts
 *
 * Env vars required:
 *   NEXT_PUBLIC_SITE_URL  — e.g. https://bialoczerwoni.live
 *   NEXT_PUBLIC_CMS_API_URL — CMS base URL for fetching article slugs
 *   INDEXNOW_KEY (optional) — defaults to the key baked into lib/indexnow.ts
 */

// Load env vars from .env.local when running outside Next.js
import { config } from 'dotenv'
config({ path: '.env.local' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
const CMS_BASE = process.env.NEXT_PUBLIC_CMS_API_URL || 'https://api.golazopro.com/api'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '684dda242b75445fad9347d2e7bb62dc'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`
const BATCH_SIZE = 10_000
const BATCH_DELAY_MS = 1000

// ── Static routes ─────────────────────────────────────────────────────────────
const STATIC_PATHS = [
  '/',
  '/wm-2026',
  '/wm-2026/gruppen',
  '/wm-2026/spielplan',
  '/wm-2026/ergebnisse',
  '/wm-2026/bracket',
  '/ms-2026',
  '/ms-2026/grupy',
  '/ms-2026/terminarz',
  '/ms-2026/faza-pucharowa',
  '/teams',
  '/spiele',
  '/spieler',
  '/torschuetzen',
  '/statistiken',
  '/stadien',
  '/ligen',
  '/news',
  '/vorhersage',
  '/reprezentacja',
  '/transfery',
]

async function fetchAllArticleSlugs(): Promise<string[]> {
  const slugs: string[] = []
  let page = 1
  const limit = 100

  console.log('[Backfill] Fetching article slugs from CMS...')

  while (true) {
    try {
      const url = new URL(`${CMS_BASE}/ai-articles`)
      url.searchParams.set('targetWebsite', 'bialoczerwoni.live')
      url.searchParams.set('page', String(page))
      url.searchParams.set('limit', String(limit))
      url.searchParams.set('sort', 'createdAt')
      url.searchParams.set('order', 'desc')

      const res = await fetch(url.toString())
      if (!res.ok) {
        console.error(`[Backfill] CMS responded ${res.status} on page ${page}`)
        break
      }

      const data = await res.json() as { data?: { slug: string }[]; meta?: { totalPages?: number } }
      const articles = data.data ?? []
      if (!articles.length) break

      for (const article of articles) {
        if (article.slug) slugs.push(article.slug)
      }

      console.log(`[Backfill] Page ${page}/${data.meta?.totalPages ?? '?'} — ${articles.length} slugs fetched`)

      const totalPages = data.meta?.totalPages ?? 1
      if (page >= totalPages) break
      page++

      // Rate-limit CMS requests
      await new Promise((r) => setTimeout(r, 200))
    } catch (err) {
      console.error('[Backfill] CMS fetch error on page', page, err)
      break
    }
  }

  return slugs
}

async function submitBatch(urlList: string[]): Promise<void> {
  const host = new URL(SITE_URL).hostname
  const body = { host, key: INDEXNOW_KEY, keyLocation: KEY_LOCATION, urlList }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })

  console.log(`[Backfill] IndexNow → HTTP ${res.status} for ${urlList.length} URLs`)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[Backfill] Response body:', text)
  }
}

async function main() {
  const locales = ['pl', 'en']

  // Static pages
  const staticUrls: string[] = []
  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      staticUrls.push(`${SITE_URL}/${locale}${path === '/' ? '' : path}`)
    }
  }

  // Dynamic article pages
  const slugs = await fetchAllArticleSlugs()
  const articleUrls: string[] = []
  for (const locale of locales) {
    for (const slug of slugs) {
      articleUrls.push(`${SITE_URL}/${locale}/wiadomosc/${slug}`)
    }
  }

  const allUrls = [...new Set([...staticUrls, ...articleUrls])]
  console.log(`[Backfill] Total unique URLs: ${allUrls.length}`)

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE)
    await submitBatch(batch)
    if (i + BATCH_SIZE < allUrls.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  console.log('[Backfill] Done.')
}

main().catch((err) => {
  console.error('[Backfill] Fatal error:', err)
  process.exit(1)
})
