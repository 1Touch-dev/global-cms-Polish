import { getWMGruppenData } from '@/lib/serverData'
import { MOCK_GRUPPEN } from '@/lib/mock-data'
import GruppenPageClient from './_components/GruppenPageClient'

export default async function GruppenPage() {
  const apiGruppen = await getWMGruppenData()
  const gruppen = apiGruppen.length > 0 ? apiGruppen : MOCK_GRUPPEN

  return <GruppenPageClient gruppen={gruppen} />
}
