import { getWMGruppenData } from '@/lib/serverData'
import GruppenPageClient from './_components/GruppenPageClient'

export default async function GruppenPage() {
  const gruppen = await getWMGruppenData()

  return <GruppenPageClient gruppen={gruppen} />
}
