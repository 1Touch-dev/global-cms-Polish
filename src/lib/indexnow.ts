// ─────────────────────────────────────────────────────────────────────────────
// IndexNow integration — https://www.indexnow.org/
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

/**
 * The IndexNow key. Must match the filename in public/{key}.txt.
 * Override with INDEXNOW_KEY env var for production.
 */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || '684dda242b75445fad9347d2e7bb62dc'

const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`

function getHost(siteUrl: string): string {
  try {
    return new URL(siteUrl).hostname
  } catch {
    return siteUrl
  }
}

async function postToIndexNow(urlList: string[], attempt = 1): Promise<void> {
  const host = getHost(SITE_URL)

  const body = {
    host,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }

  let res: Response | null = null
  try {
    res = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
      // Don't block the caller for more than 8 seconds
      signal: AbortSignal.timeout(8000),
    })
  } catch (err) {
    console.error('[IndexNow] fetch error (attempt %d):', attempt, err)
    if (attempt === 1) {
      // Retry once after 2 s back-off
      await new Promise((r) => setTimeout(r, 2000))
      return postToIndexNow(urlList, 2)
    }
    return
  }

  console.log(`[IndexNow] HTTP ${res.status} for ${urlList.length} URL(s) — attempt ${attempt}`)

  if (!res.ok && attempt === 1) {
    // Retry once on server-side errors (5xx), not on 4xx (config error)
    if (res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000))
      return postToIndexNow(urlList, 2)
    }
    console.error('[IndexNow] non-retryable error:', res.status, await res.text().catch(() => ''))
  }
}

/**
 * Submit a single URL to IndexNow.
 * Safe to call inside API routes / server actions — never throws.
 */
export async function submitUrlToIndexNow(url: string): Promise<void> {
  try {
    await postToIndexNow([url])
  } catch (err) {
    console.error('[IndexNow] submitUrlToIndexNow failed silently:', err)
  }
}

/**
 * Submit up to 10,000 URLs in batches.
 * IndexNow recommends batches ≤ 10,000 URLs per request.
 */
export async function submitUrlsToIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return
  const BATCH = 10_000
  try {
    for (let i = 0; i < urls.length; i += BATCH) {
      await postToIndexNow(urls.slice(i, i + BATCH))
      // Small delay between batches
      if (i + BATCH < urls.length) {
        await new Promise((r) => setTimeout(r, 500))
      }
    }
  } catch (err) {
    console.error('[IndexNow] submitUrlsToIndexNow failed silently:', err)
  }
}
