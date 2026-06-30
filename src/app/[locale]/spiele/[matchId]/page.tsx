import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { FadeInSection } from '@/components/ui/PageTransition'
import { H2HVergleich as H2HCard } from '@/components/spiele/H2HVergleich'
import { SpielDetailTabs } from '@/components/spiele/SpielDetailTabs'
import { mapFixtureToSpiel } from '@/lib/dataTransformers'
import { getMatchPageData } from '@/lib/serverData'
import {
  fetchBialoCzerwoniArticlesMentioningTeams,
} from '@/lib/bialoCzerwoniApi'
import type { ApiEvent, ApiFixture, ApiLineup, ApiResponse } from '@/types/api.types'
import type { H2HVergleich, SpielEreignis, SpielStatistiken } from '@/types/spiel.types'
import AffiliateMatchWidget from '@/components/affiliates/AffiliateMatchWidget'

function toNumber(value: unknown) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value.replace('%', '').trim())
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function readStat(stats: any[] | undefined, type: string) {
  return toNumber(stats?.find((item) => item.type === type)?.value)
}

function mapStatistics(payload: unknown): SpielStatistiken {
  const response = ((payload as ApiResponse<any[]> | null)?.response || []) as any[]
  const home = response[0]?.statistics
  const away = response[1]?.statistics

  return {
    ballbesitz: [readStat(home, 'Ball Possession'), readStat(away, 'Ball Possession')],
    torschuesse: [readStat(home, 'Total Shots'), readStat(away, 'Total Shots')],
    torschuesseAufsTor: [readStat(home, 'Shots on Goal'), readStat(away, 'Shots on Goal')],
    ecken: [readStat(home, 'Corner Kicks'), readStat(away, 'Corner Kicks')],
    fouls: [readStat(home, 'Fouls'), readStat(away, 'Fouls')],
    gelbeKarten: [readStat(home, 'Yellow Cards'), readStat(away, 'Yellow Cards')],
    roteKarten: [readStat(home, 'Red Cards'), readStat(away, 'Red Cards')],
    abseits: [readStat(home, 'Offsides'), readStat(away, 'Offsides')],
    paesse: [readStat(home, 'Total passes'), readStat(away, 'Total passes')],
    passquote: [readStat(home, 'Passes accurate'), readStat(away, 'Passes accurate')],
  }
}

function hasFixtureStatistics(payload: unknown): boolean {
  const response = ((payload as ApiResponse<any[]> | null)?.response || []) as any[]
  return response.some((teamStats) =>
    teamStats?.statistics?.some((stat: { value: unknown }) => stat.value !== null && stat.value !== undefined),
  )
}

function mapEventType(event: ApiEvent): SpielEreignis['typ'] | null {
  if (event.type === 'Goal') return event.detail === 'Own Goal' ? 'Eigentor' : 'Tor'
  if (event.type === 'Card') return event.detail?.includes('Red') ? 'RoteKarte' : 'GelbeKarte'
  if (event.type === 'subst') return 'Wechsel'
  return null
}

function mapEvents(payload: unknown): SpielEreignis[] {
  const response = ((payload as ApiResponse<ApiEvent[]> | null)?.response || []) as ApiEvent[]
  return response.flatMap((event) => {
    const typ = mapEventType(event)
    if (!typ) return []

    return [{
      minute: event.time.elapsed || 0,
      typ,
      spieler: event.player?.name || 'Nieznany',
      team: event.team?.name || '',
      details: event.assist?.name ? `Asysta: ${event.assist.name}` : event.detail || undefined,
    } satisfies SpielEreignis]
  })
}

function mapHeadToHead(payload: unknown, team1Name: string, team2Name: string): H2HVergleich | null {
  const fixtures = ((payload as ApiResponse<ApiFixture[]> | null)?.response || []) as ApiFixture[]
  if (fixtures.length === 0) return null

  let team1Siege = 0
  let team2Siege = 0
  let unentschieden = 0
  let toreTeam1 = 0
  let toreTeam2 = 0

  const letzteSpiele = fixtures.slice(0, 5).map((fixture) => {
    const homeName = fixture.teams.home.name
    const awayName = fixture.teams.away.name
    const homeGoals = fixture.goals.home ?? 0
    const awayGoals = fixture.goals.away ?? 0

    if (homeName === team1Name) {
      toreTeam1 += homeGoals
      toreTeam2 += awayGoals
    } else if (awayName === team1Name) {
      toreTeam1 += awayGoals
      toreTeam2 += homeGoals
    }

    let sieger: string | null = null
    if (homeGoals > awayGoals) sieger = homeName
    if (awayGoals > homeGoals) sieger = awayName

    if (sieger === team1Name) team1Siege += 1
    else if (sieger === team2Name) team2Siege += 1
    else unentschieden += 1

    return {
      datum: fixture.fixture.date.split('T')[0],
      wettbewerb: fixture.league.round || fixture.league.name,
      ergebnis: `${homeGoals}:${awayGoals}`,
      sieger,
    }
  })

  return {
    team1: team1Name,
    team2: team2Name,
    gesamtSpiele: fixtures.length,
    team1Siege,
    unentschieden,
    team2Siege,
    toreTeam1,
    toreTeam2,
    letzteSpiele,
  }
}

export default async function MatchPage({ params }: { params: Promise<{ locale: string; matchId: string }> }) {
  const { locale, matchId } = await params
  const data = await getMatchPageData(matchId)
  const fixture = ((data.match as ApiResponse<ApiFixture[]> | null)?.response || [])[0]

  if (!fixture) {
    // Match data unavailable (API timeout or unknown ID) — show a friendly message instead of 404
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <Link href="/spiele" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
          <ArrowLeft className="h-4 w-4" />
          Wszystkie mecze
        </Link>
        <p className="mt-8 text-lg text-[var(--text-muted)]">
          {locale === 'pl' ? 'Dane meczu są chwilowo niedostępne. Spróbuj ponownie.' : 'Match data temporarily unavailable. Please try again.'}
        </p>
      </div>
    )
  }

  const spiel = mapFixtureToSpiel(fixture)
  const statistiken = mapStatistics(data.stats)
  const hasStatistics = hasFixtureStatistics(data.stats)
  const ereignisse = mapEvents(data.events)
  const lineups = ((data.lineups as ApiResponse<ApiLineup[]> | null)?.response || []) as ApiLineup[]
  const h2h = mapHeadToHead(data.h2h, spiel.team1.name, spiel.team2.name)
  const relatedNews = await fetchBialoCzerwoniArticlesMentioningTeams(
    [spiel.team1.name, spiel.team2.name],
    4,
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/spiele" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
        <ArrowLeft className="h-4 w-4" />
        Wszystkie mecze
      </Link>

      <div className="space-y-6">
        <AffiliateMatchWidget
          locale={locale}
          homeTeam={spiel.team1.name}
          awayTeam={spiel.team2.name}
        />

        <FadeInSection>
          <SpielDetailTabs
            spiel={spiel}
            statistiken={statistiken}
            hasStatistics={hasStatistics}
            ereignisse={ereignisse}
            lineups={lineups}
            news={relatedNews}
            locale={locale}
          />
        </FadeInSection>

        {h2h && (
          <FadeInSection delay={0.1}>
            <H2HCard data={h2h} />
          </FadeInSection>
        )}
      </div>
    </div>
  )
}
