import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { VolleyballHub } from '@/components/sports/VolleyballHub'
import { fetchBialoCzerwoniVolleyball } from '@/lib/bialoCzerwoniApi'
import { getPolandVolleyballHomeData } from '@/lib/sportsdb'

export const revalidate = 300

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isPl = locale !== 'en'
  return {
    title: isPl ? 'Siatkówka | Biało-Czerwoni' : 'Volleyball | Biało-Czerwoni',
    description: isPl
      ? 'PlusLiga i krajowa siatkówka — ligi, mecze i aktualności. Piłka nożna pozostaje główna.'
      : 'PlusLiga and Polish volleyball leagues, upcoming games and news. Football coverage stays.',
  }
}

export default async function PolishVolleyballPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { page: pageStr } = await searchParams
  setRequestLocale(locale)
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const [{ leagues, events }, cms] = await Promise.all([
    getPolandVolleyballHomeData().catch(() => ({ leagues: [], events: [], primary: null })),
    fetchBialoCzerwoniVolleyball(page, 12, locale).catch(() => ({
      data: [],
      meta: { total: 0, currentPage: page, totalPages: 0, limit: 12 },
    })),
  ])

  return (
    <VolleyballHub
      locale={locale}
      leagues={leagues}
      events={events}
      articles={cms.data}
      meta={cms.meta}
      page={page}
    />
  )
}
