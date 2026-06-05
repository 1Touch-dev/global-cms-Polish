import { getTorschuetzenPageData } from '@/lib/serverData'
import TorschuetzenPageClient from './_components/TorschuetzenPageClient'

export default async function TorschuetzenPage() {
  const { torschuetzen } = await getTorschuetzenPageData()

  return <TorschuetzenPageClient torschuetzen={torschuetzen} />
}
