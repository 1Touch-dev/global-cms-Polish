import { getHomepageData } from '@/lib/serverData'
import { fetchBialoCzerwoniHomePage } from '@/lib/bialoCzerwoniApi'
import HomePageClient from './_components/HomePageClient'

export const revalidate = 60

export default async function HomePage() {
  const [{ aktuelleSpiele, scorers, gruppen }, cmsHome] = await Promise.all([
    getHomepageData(),
    fetchBialoCzerwoniHomePage(9),
  ])

  return (
    <HomePageClient
      aktuelleSpiele={aktuelleSpiele}
      scorers={scorers}
      gruppen={gruppen}
      cmsArticles={cmsHome?.data ?? []}
    />
  )
}
