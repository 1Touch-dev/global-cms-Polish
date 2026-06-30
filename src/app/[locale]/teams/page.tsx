import type { Metadata } from 'next'
import { getTeamsPageData } from '@/lib/serverData'
import TeamsPageClient from './_components/TeamsPageClient'
import { getPageMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return getPageMetadata('teams', locale, '/teams')
}

export const revalidate = 60

export default async function TeamsPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // ensures locale params are resolved
  const { teams, gruppen } = await getTeamsPageData()

  return <TeamsPageClient teams={teams} gruppen={gruppen} />
}
