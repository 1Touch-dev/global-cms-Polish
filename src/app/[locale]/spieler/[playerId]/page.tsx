import { fetchPlayerById } from '@/lib/footballApi'
import SpielerDetailClient from './_components/SpielerDetailClient'

export default async function SpielerDetailPage({ params }: { params: Promise<{ playerId: string }> }) {
  const { playerId } = await params

  const res = await fetchPlayerById(playerId) as any

  // response is array of stats across leagues — use it directly
  const playerData = res?.response?.[0] || null

  return <SpielerDetailClient playerId={playerId} playerData={playerData} />
}
