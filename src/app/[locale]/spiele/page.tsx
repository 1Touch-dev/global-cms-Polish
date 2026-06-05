import { getSpielePageData } from '@/lib/serverData'
import SpielePageClient from './_components/SpielePageClient'

export default async function SpielePage() {
  const { liveSpiele, upcomingSpiele, pastSpiele } = await getSpielePageData()

  return (
    <SpielePageClient
      liveSpiele={liveSpiele}
      upcomingSpiele={upcomingSpiele}
      pastSpiele={pastSpiele}
    />
  )
}
