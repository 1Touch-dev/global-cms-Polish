import { getSpielerPageData } from '@/lib/serverData'
import SpielerPageClient from './_components/SpielerPageClient'

export default async function SpielerPage() {
  const { spieler } = await getSpielerPageData()

  return <SpielerPageClient spieler={spieler} />
}
