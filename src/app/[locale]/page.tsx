import { getHomepageData } from '@/lib/serverData'
import HomePageClient from './_components/HomePageClient'

export default async function HomePage() {
  const { aktuelleSpiele, scorers, gruppen } = await getHomepageData()

  return (
    <HomePageClient
      aktuelleSpiele={aktuelleSpiele}
      scorers={scorers}
      gruppen={gruppen}
    />
  )
}
