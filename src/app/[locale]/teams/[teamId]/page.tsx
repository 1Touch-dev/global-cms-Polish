import { getTeamDetailPageData } from '@/lib/serverData'
import { notFound } from 'next/navigation'
import TeamDetailClient from './_components/TeamDetailClient'
import { TeamJsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/metadata'

export default async function TeamDetailPage({ params }: { params: Promise<{ locale: string; teamId: string }> }) {
  const { locale, teamId } = await params

  const data = await getTeamDetailPageData(teamId)

  if (!data.team) notFound()

  return (
    <>
      <TeamJsonLd
        name={data.team.name}
        logo={data.team.wappen}
        country={data.team.land}
        url={`${SITE_URL}/${locale}/teams/${teamId}`}
        gruppe={data.gruppe || data.team.gruppe}
      />
      <TeamDetailClient teamId={teamId} apiData={data} mockTeam={null} />
    </>
  )
}
