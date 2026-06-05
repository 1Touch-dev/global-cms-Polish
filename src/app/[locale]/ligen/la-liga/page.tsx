import { getLigaPageData, LIGA_CONFIG } from '@/lib/serverData'
import { TabellenZone } from '@/types/liga.types'
import LigaPageClient from '../_components/LigaPageClient'

const LIGA_SLUG = 'la-liga'

export default async function LaLigaPage() {
  const data = await getLigaPageData(LIGA_SLUG)
  const config = LIGA_CONFIG[LIGA_SLUG]

  return (
    <LigaPageClient
      ligaSlug={LIGA_SLUG}
      config={config}
      tabelle={data?.tabelle || []}
      zones={config.zones as TabellenZone[]}
      topScorer={data?.topScorer || []}
      recentFixtures={data?.recentFixtures || []}
      ligaLogo={data?.ligaLogo}
      saison={data?.saison || config.season}
    />
  )
}
