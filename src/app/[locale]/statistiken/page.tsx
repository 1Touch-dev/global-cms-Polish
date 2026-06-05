import { getStatistikenPageData } from '@/lib/serverData'
import StatistikenPageClient from './_components/StatistikenPageClient'

export default async function StatistikenPage() {
  const { topScorerData, topAssistData, topCardsData } = await getStatistikenPageData()

  return (
    <StatistikenPageClient
      topScorerData={topScorerData}
      topAssistData={topAssistData}
      topCardsData={topCardsData}
    />
  )
}
