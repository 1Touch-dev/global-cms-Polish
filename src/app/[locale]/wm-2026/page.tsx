import { getWMGruppenData } from '@/lib/serverData'
import { MOCK_GRUPPEN } from '@/lib/mock-data'
import WM2026PageClient from './_components/WM2026PageClient'

export default async function WM2026Page() {
  const apiGruppen = await getWMGruppenData()
  const gruppen = apiGruppen.length > 0 ? apiGruppen : MOCK_GRUPPEN

  return <WM2026PageClient gruppen={gruppen} />
}
