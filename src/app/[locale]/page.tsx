import type { Metadata } from 'next'
import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage, fetchBialoCzerwoniPublicBanners, fetchBialoCzerwoniVolleyball, rewriteBialoCzerwoniBannerHtml, type BialoCzerwoniBanner } from '@/lib/bialoCzerwoniApi'
import { getPolandVolleyballHomeData } from '@/lib/sportsdb'
import { translateBannerHtml } from '@/lib/translate'
import HomePageClient from './_components/HomePageClient'
import { getPageMetadata } from '@/lib/metadata'
import { HomeJsonLd } from '@/components/seo/JsonLd'
import BannerCarousel from '@/components/home/BannerCarousel'

export const dynamic = 'force-dynamic'

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

  const [{ aktuelleSpiele, scorers, gruppen }, cmsHome, bannersData, volleyballHome, volleyballCms] = await Promise.all([
    getHomepageData(),
    fetchBialoCzerwoniHomePage(9, locale),
    fetchBialoCzerwoniPublicBanners().catch(() => null),
    getPolandVolleyballHomeData().catch(() => ({ leagues: [], events: [], primary: null })),
    fetchBialoCzerwoniVolleyball(1, 3, locale).catch(() => ({ data: [], meta: { total: 0, currentPage: 1, totalPages: 0, limit: 3 } })),
  ])

  const rawBanners: BialoCzerwoniBanner[] = [
    ...(bannersData?.banner ? [bannersData.banner] : []),
    ...(bannersData?.banners ?? []),
  ].filter((b) => b.isActive !== false && b.status !== 'inactive' && b.htmlContent)

  const localizedBanners: BialoCzerwoniBanner[] = await Promise.all(
    rawBanners.map(async (b) => {
      let html = rewriteBialoCzerwoniBannerHtml(b.htmlContent!, locale)
      if (locale === 'en') html = await translateBannerHtml(html, 'pl', 'en').catch(() => html)
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
        volleyballNews={volleyballCms.data.slice(0, 3)}
        volleyballLeagues={volleyballHome.leagues}
        volleyballEvents={volleyballHome.events}
      />
    </>
  )
}
