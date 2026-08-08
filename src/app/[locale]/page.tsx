import type { Metadata } from 'next'
import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage, fetchBialoCzerwoniPublicBanners, rewriteBialoCzerwoniBannerHtml, type BialoCzerwoniBanner } from '@/lib/bialoCzerwoniApi'
import HomePageClient from './_components/HomePageClient'
import { fetchNextWorldCupMatch } from '@/lib/worldcupMatch'
import { getPageMetadata } from '@/lib/metadata'
import { HomeJsonLd } from '@/components/seo/JsonLd'
import BannerCarousel from '@/components/home/BannerCarousel'

export const revalidate = 60

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

  const [{ aktuelleSpiele, scorers, gruppen }, cmsHome, nextWorldCupMatch, bannersData] = await Promise.all([
    getHomepageData(),
    fetchBialoCzerwoniHomePage(9, locale),
    fetchNextWorldCupMatch(),
    fetchBialoCzerwoniPublicBanners().catch(() => null),
  ])

  const kickoffLabel = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pl-PL', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(nextWorldCupMatch.date))

  const rawBanners: BialoCzerwoniBanner[] = [
    ...(bannersData?.banner ? [bannersData.banner] : []),
    ...(bannersData?.banners ?? []),
  ].filter((b) => b.isActive !== false && b.status !== 'inactive' && b.htmlContent)

  const localizedBanners = rawBanners.map((b) => ({
    ...b,
    htmlContent: rewriteBialoCzerwoniBannerHtml(b.htmlContent!, locale),
  }))

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
        nextWorldCupMatch={{ ...nextWorldCupMatch, kickoffLabel }}
      />
    </>
  )
}
