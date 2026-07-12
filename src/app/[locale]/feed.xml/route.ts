import { NextRequest, NextResponse } from 'next/server'
import { fetchBialoCzerwoniNewsPage, bcThumbnail, resolveBcArticle } from '@/lib/bialoCzerwoniApi'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
const SITE_NAME = 'Biało-Czerwoni | Matchday Arena'

const FEED_META: Record<string, { title: string; description: string; language: string }> = {
  pl: {
    title: `${SITE_NAME} — Aktualności`,
    description: 'Najnowsze wiadomości piłkarskie: Mistrzostwa Świata 2026, reprezentacja Polski i czołowe ligi.',
    language: 'pl',
  },
  en: {
    title: `${SITE_NAME} — News`,
    description: 'Latest football news: FIFA World Cup 2026, Poland national team and top leagues.',
    language: 'en',
  },
}

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(dateString: string): string {
  try {
    return new Date(dateString).toUTCString()
  } catch {
    return new Date().toUTCString()
  }
}

export const revalidate = 300 // 5 minutes

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  const meta = FEED_META[locale] ?? FEED_META.pl
  const feedUrl = `${SITE_URL}/${locale}/feed.xml`
  const siteUrl = `${SITE_URL}/${locale}`

  const response = await fetchBialoCzerwoniNewsPage(1, 50, { locale })
  const articles = response?.data ?? []

  const items = articles
    .map((article) => {
      const resolved = resolveBcArticle(article, locale)
      const thumb = bcThumbnail(article)
      const articleUrl = `${SITE_URL}/${locale}/wiadomosc/${article.slug}`
      const pubDate = toRfc822(resolved.publishedAt)

      const enclosure = thumb
        ? `<enclosure url="${escapeXml(thumb)}" type="image/jpeg" length="0" />`
        : ''

      return `    <item>
      <title>${escapeXml(resolved.title)}</title>
      <link>${escapeXml(articleUrl)}</link>
      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>
      <description>${escapeXml(resolved.seoDescription || resolved.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(resolved.authorName)}</dc:creator>
      ${enclosure}
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${toRfc822(new Date().toISOString())}</lastBuildDate>
    <generator>Biało-Czerwoni / Next.js ${SITE_URL}</generator>
${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
