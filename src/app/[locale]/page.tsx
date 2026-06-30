import type { Metadata } from 'next'
import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage } from '@/lib/bialoCzerwoniApi'
import HomePageClient from './_components/HomePageClient'
import { fetchNextWorldCupMatch } from '@/lib/worldcupMatch'
import { getPageMetadata } from '@/lib/metadata'
import { HomeJsonLd } from '@/components/seo/JsonLd'

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

  const [{ aktuelleSpiele, scorers, gruppen }, cmsHome, nextWorldCupMatch] = await Promise.all([
    getHomepageData(),
    fetchBialoCzerwoniHomePage(9, locale),
    fetchNextWorldCupMatch(),
  ])

  const kickoffLabel = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'pl-PL', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(nextWorldCupMatch.date))

  return (
    <>
      <HomeJsonLd locale={locale} />
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
