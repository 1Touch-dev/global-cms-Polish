'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, Calendar, Flag, MapPin, Target, Trophy, TrendingUp, Users } from 'lucide-react'
import { CountdownTimer } from '@/components/wm/CountdownTimer'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Badge } from '@/components/ui/Badge'
import { NewsSection } from '@/components/news/NewsSection'
import type { Gruppe } from '@/types/wm.types'

interface Props {
  gruppen: Gruppe[]
  stats: {
    teams: number
    fixtures: number
    live: number
    upcoming: number
    completed: number
    groups: number
  }
}

export default function WM2026PageClient({ gruppen, stats }: Props) {
  const t = useTranslations('wm')

  const tournamentStats = [
    { label: t('mannschaften'), value: stats.teams || 48, icon: Users },
    { label: t('spieleTotal'), value: stats.fixtures || 104, icon: Calendar },
    { label: 'Live', value: stats.live, icon: TrendingUp },
    { label: 'Nadchodzące', value: stats.upcoming, icon: MapPin },
    { label: 'Zakończone', value: stats.completed, icon: Target },
    { label: t('gruppen_uebersicht'), value: stats.groups || gruppen.length, icon: Trophy },
  ]

  const schedule = [
    { label: t('gruppenphase'), range: '14.06 - 02.07', stadiums: 16, matches: 48 },
    { label: t('achtelfinale'), range: '03.07 - 06.07', stadiums: 8, matches: 8 },
    { label: t('viertelfinale'), range: '09.07 - 10.07', stadiums: 4, matches: 4 },
    { label: t('halbfinale'), range: '14.07 - 15.07', stadiums: 2, matches: 2 },
    { label: 'Mecz o 3. miejsce', range: '18.07', stadiums: 1, matches: 1 },
    { label: t('finale'), range: '19.07', stadiums: 1, matches: 1 },
  ]

  const favorites = [
    { name: 'Brazylia', flag: '🇧🇷', odds: '4.5', note: 'Głęboka kadra i ogromny potencjał w ataku.' },
    { name: 'Argentyna', flag: '🇦🇷', odds: '5.0', note: 'Obrońcy tytułu z elitarną strukturą gry.' },
    { name: 'Francja', flag: '🇫🇷', odds: '5.5', note: 'Szybkość, jakość i doświadczenie w kluczowych strefach.' },
    { name: 'Niemcy', flag: '🇩🇪', odds: '8.0', note: 'Młoda generacja oparta na intensywności i kontroli.' },
    { name: 'Anglia', flag: '🏴', odds: '8.0', note: 'Dużo jakości w środku pola i szeroki wachlarz opcji.' },
    { name: 'Hiszpania', flag: '🇪🇸', odds: '9.0', note: 'Technika, pressing i rosnąca dojrzałość młodego składu.' },
  ]

  const hostCountries = [
    { flag: '🇺🇸', name: 'USA', stadiums: 11, cities: 'New York, Los Angeles, Miami, Dallas, Houston', capacity: '82.500 avg' },
    { flag: '🇲🇽', name: 'Meksyk', stadiums: 3, cities: 'Mexico City, Guadalajara, Monterrey', capacity: '78.000 avg' },
    { flag: '🇨🇦', name: 'Kanada', stadiums: 2, cities: 'Toronto, Vancouver', capacity: '45.000 avg' },
  ]

  return (
    <div className="space-y-10 pb-12">
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg)]">
        <div className="absolute inset-0 pitch-stripe-pattern opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_18%,transparent),transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 lg:px-6 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-5">
              <Badge className="badge-gold w-fit">
                <Trophy className="h-3.5 w-3.5" />
                {t('hub')}
              </Badge>
              <div className="space-y-3">
                <h1 className="font-[var(--font-display)] text-5xl uppercase tracking-[0.06em] text-[var(--text-main)] sm:text-6xl lg:text-7xl">
                  {t('titel')}
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
                  {t('untertitel')}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/wm-2026/spielplan" className="btn-gold inline-flex items-center gap-2 px-5 py-3">
                  {t('spielplan_link')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/wm-2026/gruppen" className="btn-ghost inline-flex items-center gap-2 px-5 py-3">
                  <Flag className="h-4 w-4" />
                  {t('alle_gruppen')}
                </Link>
              </div>
            </div>

            <Card className="glass-card p-5 lg:p-6">
              <SectionHeader eyebrow={t('countdown')} title={t('hub')} />
              <div className="mt-4">
                <CountdownTimer />
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow={t('turnierstatistiken')}
          title="Matchday Arena"
        />
        <p className="-mt-2 mb-5 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Najważniejsze liczby turnieju i szybki przegląd skali całego wydarzenia.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {tournamentStats.map((stat) => (
            <Card key={stat.label} className="glass-card p-5">
              <div className="flex items-center justify-between">
                <stat.icon className="h-5 w-5 text-[var(--accent)]" />
                <span className="badge-gold text-[10px] uppercase tracking-[0.22em]">{stat.label}</span>
              </div>
              <div className="mt-5 text-3xl font-semibold text-[var(--text-main)]">{stat.value}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow={t('turnierablauf')}
          title={t('spielplan_link')}
        />
        <p className="-mt-2 mb-5 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Najważniejsze etapy turnieju uporządkowane w czytelnym układzie.
        </p>
        <div className="grid gap-3">
          {schedule.map((phase, index) => (
            <Card key={phase.label} className="glass-card p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--accent)]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-main)]">{phase.label}</p>
                    <p className="text-sm text-[var(--text-muted)]">{phase.range}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="badge-gold">{t('spiele_label', { count: phase.matches })}</span>
                  <span className="badge-gold">{t('stadien_label', { count: phase.stadiums })}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow={t('favoriten')}
          title="Top 6"
        />
        <p className="-mt-2 mb-5 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Bukmacherzy i analiza formy wskazują kilku oczywistych kandydatów.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favorites.map((team) => (
            <Card key={team.name} className="glass-card p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{team.flag}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="truncate text-lg font-semibold text-[var(--text-main)]">{team.name}</h3>
                    <span className="badge-gold shrink-0">{team.odds}x</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{team.note}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow={t('gastgeberlaender')}
          title={t('gastgeber')}
        />
        <p className="-mt-2 mb-5 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Trzy kraje-gospodarze, trzy profile infrastrukturalne i różne pojemności stadionów.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {hostCountries.map((country) => (
            <Card key={country.name} className="glass-card p-5">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{country.flag}</div>
                <div>
                  <p className="text-lg font-semibold text-[var(--text-main)]">{country.name}</p>
                  <p className="text-sm text-[var(--accent)]">{t('stadien_label', { count: country.stadiums })}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[var(--text-muted)]">{t('staedte')}</dt>
                  <dd className="max-w-[60%] text-right text-[var(--text-secondary)]">{country.cities}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[var(--text-muted)]">{t('kapazitaet_avg')}</dt>
                  <dd className="text-[var(--text-secondary)]">{country.capacity}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeader
          eyebrow={t('gruppen_uebersicht')}
          title={t('alle_gruppen')}
        />
        <p className="-mt-2 mb-5 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Szybki podgląd układu grup i pozycji zespołów przed wejściem w szczegóły.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {gruppen.slice(0, 8).map((gruppe) => (
            <Card key={gruppe.name} className="glass-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-[var(--accent)]">
                  {t('gruppe')} {gruppe.name}
                </h3>
                <Link href="/wm-2026/gruppen" className="text-xs text-[var(--text-muted)] transition hover:text-[var(--accent)]">
                  {t('alle')}
                </Link>
              </div>
              <div className="space-y-2">
                {gruppe.teams.map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between gap-3 rounded-xl bg-[var(--surface-soft)] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-4 text-xs text-[var(--text-muted)]">{index + 1}.</span>
                      <span className="text-sm">{team.flagge}</span>
                      <span className="truncate text-sm text-[var(--text-main)]">{team.name}</span>
                    </div>
                    <span className="badge-gold shrink-0">{team.punkte}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <NewsSection titel={t('nachrichten')} source="wm" maxArtikel={4} />
      </section>
    </div>
  )
}
