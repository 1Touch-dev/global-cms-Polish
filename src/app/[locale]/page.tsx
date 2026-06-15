import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage } from '@/lib/bialoCzerwoniApi'
import HomePageClient from './_components/HomePageClient'
import { fetchNextWorldCupMatch } from '@/lib/worldcupMatch'

export const revalidate = 60

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
    <HomePageClient
      aktuelleSpiele={aktuelleSpiele}
      scorers={scorers}
      gruppen={gruppen}
      cmsArticles={cmsHome?.data ?? []}
      nextWorldCupMatch={{ ...nextWorldCupMatch, kickoffLabel }}
    />
  )
}
