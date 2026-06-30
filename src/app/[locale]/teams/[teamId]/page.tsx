import { getTeamDetailPageData } from '@/lib/serverData'
import { notFound } from 'next/navigation'
import TeamDetailClient from './_components/TeamDetailClient'

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params

  const data = await getTeamDetailPageData(teamId)

  if (!data.team) notFound()

  return <TeamDetailClient teamId={teamId} apiData={data} mockTeam={null} />
}
