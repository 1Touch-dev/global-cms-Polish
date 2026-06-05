import { getTeamsPageData } from '@/lib/serverData'
import TeamsPageClient from './_components/TeamsPageClient'

export default async function TeamsPage() {
  const { teams, gruppen } = await getTeamsPageData()

  return <TeamsPageClient teams={teams} gruppen={gruppen} />
}
