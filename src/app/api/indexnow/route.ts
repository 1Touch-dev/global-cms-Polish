import { NextRequest, NextResponse } from 'next/server'
import { submitUrlToIndexNow, submitUrlsToIndexNow } from '@/lib/indexnow'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
const WEBHOOK_SECRET = process.env.CMS_WEBHOOK_SECRET || ''

/**
 * POST /api/indexnow
 *
 * Called by the CMS when content is published or updated.
 * Body: { slug?: string; slugs?: string[]; path?: string; paths?: string[] }
 *
 * Secured by CMS_WEBHOOK_SECRET header (x-webhook-secret) when configured.
 */
export async function POST(req: NextRequest) {
  // Verify secret when configured
  if (WEBHOOK_SECRET) {
    const incoming = req.headers.get('x-webhook-secret')
    if (incoming !== WEBHOOK_SECRET) {
      console.warn('[IndexNow webhook] Unauthorized request — wrong or missing secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const payload = body as {
    slug?: string
    slugs?: string[]
    path?: string
    paths?: string[]
  }

  const urls: string[] = []

  // Single slug → article URL in both locales
  if (payload.slug) {
    urls.push(
      `${SITE_URL}/pl/wiadomosc/${payload.slug}`,
      `${SITE_URL}/en/wiadomosc/${payload.slug}`,
    )
  }

  // Multiple slugs
  if (Array.isArray(payload.slugs)) {
    for (const slug of payload.slugs) {
      urls.push(
        `${SITE_URL}/pl/wiadomosc/${slug}`,
        `${SITE_URL}/en/wiadomosc/${slug}`,
      )
    }
  }

  // Arbitrary path (e.g. a match page)
  if (payload.path) {
    urls.push(`${SITE_URL}${payload.path}`)
  }

  // Multiple paths
  if (Array.isArray(payload.paths)) {
    for (const path of payload.paths) {
      urls.push(`${SITE_URL}${path}`)
    }
  }

  if (!urls.length) {
    return NextResponse.json({ error: 'No URLs derived from payload' }, { status: 400 })
  }

  // Fire-and-forget — don't block response
  submitUrlsToIndexNow(urls).catch((err) =>
    console.error('[IndexNow webhook] background submit error:', err),
  )

  console.log('[IndexNow webhook] queued', urls.length, 'URL(s):', urls)
  return NextResponse.json({ queued: urls.length, urls })
}

/** GET /api/indexnow — health check */
export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: '/api/indexnow' })
}
