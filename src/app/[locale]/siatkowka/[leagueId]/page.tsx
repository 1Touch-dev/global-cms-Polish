import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { VolleyballLeagueHub } from '@/components/sports/VolleyballHub'
import { fetchBialoCzerwoniVolleyball } from '@/lib/bialoCzerwoniApi'
import { getLeagueHub } from '@/lib/sportsdb'

export const revalidate = 300

interface Props {
  params: Promise<{ locale: string; leagueId: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, leagueId } = await params
  const { league } = await getLeagueHub(leagueId)
  const name = league?.name ?? (locale === 'en' ? 'Volleyball league' : 'Liga siatkówki')
  return {
    title: `${name} | Biało-Czerwoni`,
    description:
      locale === 'en'
        ? `${name} fixtures, teams and volleyball news. Football coverage stays.`
        : `${name} — mecze, drużyny i aktualności siatkówki. Piłka nożna pozostaje główna.`,
  }
}

export default async function PolishVolleyballLeaguePage({ params, searchParams }: Props) {
  const { locale, leagueId } = await params
  const { page: pageStr } = await searchParams
  setRequestLocale(locale)
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const [{ league, events, teams }, cms] = await Promise.all([
    getLeagueHub(leagueId).catch(() => ({ league: null, events: [], teams: [] })),
    fetchBialoCzerwoniVolleyball(page, 12, locale).catch(() => ({
      data: [],
      meta: { total: 0, currentPage: page, totalPages: 0, limit: 12 },
    })),
  ])

  if (!league) notFound()

  return (
    <VolleyballLeagueHub
      locale={locale}
      league={league}
      events={events}
      teams={teams}
      articles={cms.data}
      meta={cms.meta}
      page={page}
    />
  )
}
