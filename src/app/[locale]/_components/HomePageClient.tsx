'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, CalendarDays, Trophy, Activity, Gauge, Sparkles } from 'lucide-react'
import { FadeInSection } from '@/components/ui/PageTransition'
import { Spiel } from '@/types/spiel.types'
import { LiveMatchCard } from '@/components/layout/LiveMatchCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LeagueCard } from '@/components/layout/LeagueCard'
import { CountdownTimer } from '@/components/wm/CountdownTimer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { BcFeaturedCard } from '@/components/cms/BcFeaturedCard'
import { BcArticleCard } from '@/components/cms/BcArticleCard'
import type { BialoCzerwoniArticle } from '@/lib/bialoCzerwoniApi'
import type { WorldCupMatchHeroData } from '@/lib/worldcupMatch'
import AffiliateBannerFrame from '@/components/affiliates/AffiliateBannerFrame'
import AffiliateOfferCard from '@/components/affiliates/AffiliateOfferCard'

type HeroMatch = WorldCupMatchHeroData & {
  kickoffLabel: string
}

interface HomePageProps {
  aktuelleSpiele: Spiel[]
  scorers: {
    rang: number
    name: string
    flagge: string
    nationalitaet: string
    verein: string
    vereinLogo?: string
    tore: number
    photo?: string
  }[]
  gruppen: {
    name: string
    teams: {
      id: number
      name: string
      kurzname: string
      flagge: string
      wappen?: string
      punkte: number
      form: string[]
    }[]
  }[]
  cmsArticles: BialoCzerwoniArticle[]
  nextWorldCupMatch: HeroMatch
}

export default function HomePageClient({ aktuelleSpiele, scorers, gruppen, cmsArticles, nextWorldCupMatch }: HomePageProps) {
  const tHome = useTranslations('home')
  const locale = useLocale()
  const isEnglish = locale === 'en'

  const topTeams = Array.from(
    new Map(gruppen.flatMap((group) => group.teams).map((team) => [team.id, team])).values(),
  )
    .sort((a, b) => b.punkte - a.punkte)
    .slice(0, 8)

  const featuredArticle = cmsArticles[0]
  const restArticles = cmsArticles.slice(1, 7)

  const heroStats = [
    { value: '48', label: isEnglish ? 'Teams' : 'Drużyn', icon: Trophy },
    { value: '104', label: isEnglish ? 'Matches' : 'Meczów', icon: Activity },
    { value: '16', label: isEnglish ? 'Stadiums' : 'Stadionów', icon: CalendarDays },
    { value: '39', label: isEnglish ? 'Days' : 'Dni', icon: Gauge },
  ]

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--text-muted)] shadow-[var(--shadow-soft)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                Matchday Arena
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-5xl leading-none text-[var(--text-main)] md:text-7xl">
                  {isEnglish ? 'World Cup 2026 in a new matchday frame' : 'Mistrzostwa Świata 2026 w nowej oprawie'}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] md:text-lg">
                  {isEnglish
                    ? 'A premium football dashboard with live scores, standings, league shortcuts and newsroom coverage.'
                    : 'Premium piłkarski dashboard z wynikami na żywo, tabelami, skrótami ligowymi i newsroomem.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {heroStats.map((stat) => (
                  <Card key={stat.label} className="flex min-w-[160px] items-center gap-3 px-4 py-3">
                    <stat.icon className="h-5 w-5 text-[var(--accent)]" />
                    <div>
                      <p className="text-xl text-[var(--text-main)]">{stat.value}</p>
                      <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button href="/wm-2026" variant="primary">
                  {isEnglish ? 'Open tournament hub' : 'Otwórz centrum turnieju'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/wm-2026/spielplan" variant="secondary">
                  {isEnglish ? 'View schedule' : 'Zobacz terminarz'}
                </Button>
              </div>
            </div>

            <Card className="pitch-frame p-5 md:p-6">
              <div className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--accent)]">{isEnglish ? 'Live desk' : 'Pulpit live'}</p>
                  <h2 className="text-2xl text-[var(--text-main)]">{isEnglish ? 'Current fixtures' : 'Aktualne mecze'}</h2>
                </div>
                <Link href="/spiele" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                  {isEnglish ? 'All matches' : 'Wszystkie mecze'} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {aktuelleSpiele.length > 0 ? (
                  aktuelleSpiele.slice(0, 3).map((spiel, index) => (
                    <LiveMatchCard key={`${spiel.id}-${index}`} spiel={spiel} />
                  ))
                ) : (
                  <Card className="flex min-h-[180px] items-center justify-center text-center">
                    <p className="text-sm text-[var(--text-muted)]">{isEnglish ? 'No live games at the moment.' : 'Brak meczów na żywo.'}</p>
                  </Card>
                )}
              </div>
            </Card>
          </div>

          <Card className="mt-8 p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--accent)]">
                  {isEnglish ? 'Next World Cup match' : 'Najblizszy mecz MS'}
                </p>
                <h2 className="text-2xl text-[var(--text-main)]">{nextWorldCupMatch.round}</h2>
              </div>
              <Link href={nextWorldCupMatch.id ? `/spiele/${nextWorldCupMatch.id}` : '/wm-2026/spielplan'} className="text-sm font-semibold text-[var(--accent)]">
                {isEnglish ? 'Open match' : 'Otworz mecz'}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
              <div className="flex items-center gap-3 md:justify-end">
                {nextWorldCupMatch.homeTeam.logo ? (
                  <img src={nextWorldCupMatch.homeTeam.logo} alt={nextWorldCupMatch.homeTeam.name} className="h-12 w-12 object-contain" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-xs font-semibold text-[var(--text-main)]">
                    {nextWorldCupMatch.homeTeam.shortName}
                  </span>
                )}
                <div className="text-left md:text-right">
                  <p className="text-sm text-[var(--text-main)]">{nextWorldCupMatch.homeTeam.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{nextWorldCupMatch.homeTeam.shortName}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl text-[var(--accent)]">VS</p>
                <p className="text-xs text-[var(--text-muted)]">{nextWorldCupMatch.tournament}</p>
              </div>
              <div className="flex items-center gap-3">
                {nextWorldCupMatch.awayTeam.logo ? (
                  <img src={nextWorldCupMatch.awayTeam.logo} alt={nextWorldCupMatch.awayTeam.name} className="h-12 w-12 object-contain" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-xs font-semibold text-[var(--text-main)]">
                    {nextWorldCupMatch.awayTeam.shortName}
                  </span>
                )}
                <div>
                  <p className="text-sm text-[var(--text-main)]">{nextWorldCupMatch.awayTeam.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{nextWorldCupMatch.awayTeam.shortName}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-[var(--text-muted)] md:grid-cols-3">
              <p>{nextWorldCupMatch.kickoffLabel}</p>
              <p>{nextWorldCupMatch.venue}</p>
              <p>{nextWorldCupMatch.location}</p>
            </div>
            <div className="mt-5">
              <CountdownTimer targetDate={nextWorldCupMatch.date} />
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <AffiliateBannerFrame locale={locale} />
          <AffiliateOfferCard locale={locale} compact />
        </div>
        <AffiliateBannerFrame locale={locale} variant="horizontalWide" className="mt-6" />
      </section>

      <FadeInSection>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <SectionHeader
            title={tHome('top_torschuetzen')}
            eyebrow={isEnglish ? 'Scoring race' : 'Rywalizacja strzelców'}
            actions={
              <Link href="/torschuetzen" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                {tHome('vollstaendige_liste')} <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <Card className="space-y-3">
              {scorers.slice(0, 5).map((scorer, index) => (
                <div
                  key={scorer.rang}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-transparent px-3 py-3 transition hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--text-main)]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm text-[var(--text-main)]">{scorer.name}</p>
                      <p className="truncate text-xs text-[var(--text-muted)]">{scorer.verein}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl text-[var(--accent)]">{scorer.tore}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {tHome.has('hero_tore') ? tHome('hero_tore') : isEnglish ? 'goals' : 'goli'}
                    </span>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="space-y-4">
              <p className="text-xs font-semibold uppercase text-[var(--accent)]">{isEnglish ? 'Top teams' : 'Najlepsze drużyny'}</p>
              <div className="grid grid-cols-2 gap-3">
                {topTeams.slice(0, 4).map((team) => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <Card className="card-hover h-full p-4">
                      <p className="text-sm text-[var(--text-main)]">{team.name}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {isEnglish ? 'Points' : 'Punkty'}: <span className="text-[var(--accent)]">{team.punkte}</span>
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.05}>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <SectionHeader
            title={tHome('aktuelle_news')}
            eyebrow="Newsroom"
            actions={
              <Link href="/ms-2026" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                {tHome('alle_nachrichten')} <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          {featuredArticle ? (
            <div className="space-y-5">
              <BcFeaturedCard article={featuredArticle} locale={locale} />
              {restArticles.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {restArticles.map((article) => (
                    <BcArticleCard key={article._id} article={article} locale={locale} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card className="flex min-h-[200px] items-center justify-center text-sm text-[var(--text-muted)]">
              Ładowanie aktualności…
            </Card>
          )}
        </section>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <section className="mx-auto max-w-7xl px-4 py-10">
          <SectionHeader
            title={tHome('ligen_section')}
            eyebrow={isEnglish ? 'Quick access' : 'Skróty ligowe'}
          />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {[
              { name: 'Bundesliga', href: '/ligen/bundesliga', flag: '🇩🇪', top: isEnglish ? 'Bayern Munich' : 'Bayern Monachium' },
              { name: 'Champions League', href: '/ligen/champions-league', flag: '🇪🇺', top: 'Real Madrid' },
              { name: 'Premier League', href: '/ligen/premier-league', flag: '🏴', top: 'Manchester City' },
              { name: 'La Liga', href: '/ligen/la-liga', flag: '🇪🇸', top: 'Real Madrid' },
              { name: 'Serie A', href: '/ligen/serie-a', flag: '🇮🇹', top: 'Inter' },
              { name: 'Ligue 1', href: '/ligen/ligue-1', flag: '🇫🇷', top: 'PSG' },
            ].map((league) => (
              <LeagueCard key={league.href} {...league} />
            ))}
          </div>
        </section>
      </FadeInSection>

      <FadeInSection delay={0.15}>
        <section className="mx-auto max-w-7xl px-4 py-10 pb-16">
          <SectionHeader
            title={isEnglish ? 'More coverage' : 'Więcej materiałów'}
            eyebrow={isEnglish ? 'Categories' : 'Kategorie'}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {restArticles.slice(3).map((article) => (
              <BcArticleCard key={article._id} article={article} locale={locale} />
            ))}
          </div>
        </section>
      </FadeInSection>
    </div>
  )
}
