import type { Metadata } from 'next'
import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage, fetchBialoCzerwoniPublicBanners, rewriteBialoCzerwoniBannerHtml, type BialoCzerwoniBanner } from '@/lib/bialoCzerwoniApi'
import HomePageClient from './_components/HomePageClient'
import { getPageMetadata } from '@/lib/metadata'
import { HomeJsonLd } from '@/components/seo/JsonLd'
import BannerCarousel from '@/components/home/BannerCarousel'

export const revalidate = 60

async function translateHtml(html: string, fromLang: string, toLang: string): Promise<string> {
  const textNodes: string[] = []
  const template = html.replace(/>([^<]+)</g, (match, text: string) => {
    const trimmed = text.trim()
    if (!trimmed || trimmed.length < 2 || /^[\d\s.,!?:;/%\-–—()\[\]"']+$/.test(trimmed)) return match
    const idx = textNodes.length
    textNodes.push(trimmed)
    return `>__T${idx}__<`
  })
  if (textNodes.length === 0) return html
  try {
    const url = new URL('https://translate.googleapis.com/translate_a/single')
    url.searchParams.set('client', 'gtx')
    url.searchParams.set('sl', fromLang)
    url.searchParams.set('tl', toLang)
    url.searchParams.set('dt', 't')
    url.searchParams.set('q', textNodes.join('\n'))
    const ac = new AbortController()
    setTimeout(() => ac.abort(), 8000)
    const res = await fetch(url.toString(), { next: { revalidate: 3600 }, signal: ac.signal })
    if (!res.ok) return html
    const data = await res.json() as [[[string, string]]]
    const joined = (data[0] as [string, string][]).map(s => s[0]).join('')
    const parts = joined.split('\n')
    return template.replace(/__T(\d+)__/g, (_, i) => parts[Number(i)]?.trim() || textNodes[Number(i)])
  } catch {
    return html
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return getPageMetadata('home', locale, '/')
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  const [{ aktuelleSpiele, scorers, gruppen }, cmsHome, bannersData] = await Promise.all([
    getHomepageData(),
    fetchBialoCzerwoniHomePage(9, locale),
    fetchBialoCzerwoniPublicBanners().catch(() => null),
  ])

  const rawBanners: BialoCzerwoniBanner[] = [
    ...(bannersData?.banner ? [bannersData.banner] : []),
    ...(bannersData?.banners ?? []),
  ].filter((b) => b.isActive !== false && b.status !== 'inactive' && b.htmlContent)

  const localizedBanners: BialoCzerwoniBanner[] = await Promise.all(
    rawBanners.map(async (b) => {
      let html = rewriteBialoCzerwoniBannerHtml(b.htmlContent!, locale)
      if (locale === 'en') html = await translateHtml(html, 'pl', 'en').catch(() => html)
      return { ...b, htmlContent: html }
    })
  )

  return (
    <>
      <HomeJsonLd locale={locale} />
      {localizedBanners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
          <BannerCarousel banners={localizedBanners} locale={locale} />
        </div>
      )}
      <HomePageClient
        aktuelleSpiele={aktuelleSpiele}
        scorers={scorers}
        gruppen={gruppen}
        cmsArticles={cmsHome?.data ?? []}
      />
    </>
  )
}
