import { getTeamDetailPageData } from '@/lib/serverData'
import { MOCK_GRUPPEN } from '@/lib/mock-data'
import { notFound } from 'next/navigation'
import TeamDetailClient from './_components/TeamDetailClient'

export default async function TeamDetailPage({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params

  // Try real API first
  const data = await getTeamDetailPageData(teamId)

  // Fallback: find from mock data if API returns nothing
  if (!data.team) {
    const allMockTeams = MOCK_GRUPPEN.flatMap(g =>
      g.teams.map(t => ({ ...t, gruppe: g.name, gruppenTeams: g.teams }))
    )
    const mockTeam = allMockTeams.find(t => t.id === Number(teamId))
    if (!mockTeam) notFound()
    return <TeamDetailClient teamId={teamId} apiData={null} mockTeam={mockTeam} />
  }

  return <TeamDetailClient teamId={teamId} apiData={data} mockTeam={null} />
}
