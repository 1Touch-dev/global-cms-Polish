import { getTeamDetailPageData } from '@/lib/serverData'
import { notFound } from 'next/navigation'
import TeamDetailClient from './_components/TeamDetailClient'
import { TeamJsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/metadata'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'

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
      <BreadcrumbSchema
        crumbs={[
          { name: locale === 'pl' ? 'Strona główna' : 'Home', url: `${SITE_URL}/${locale}` },
          { name: locale === 'pl' ? 'Drużyny' : 'Teams', url: `${SITE_URL}/${locale}/teams` },
          { name: data.team.name, url: `${SITE_URL}/${locale}/teams/${teamId}` },
        ]}
      />
      <TeamDetailClient teamId={teamId} apiData={data} mockTeam={null} />
    </>
  )
}
