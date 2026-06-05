import { getWMSpielplanData } from '@/lib/serverData'
import SpielplanPageClient from './_components/SpielplanPageClient'

export default async function SpielplanPage() {
  const spiele = await getWMSpielplanData()
  return <SpielplanPageClient spiele={spiele} />
}
