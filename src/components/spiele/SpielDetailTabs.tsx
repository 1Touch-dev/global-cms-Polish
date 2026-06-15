'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BarChart3, CalendarClock, FileText, Newspaper, Users } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SpielTimeline } from '@/components/spiele/SpielTimeline'
import {
  bcPrimaryCategory,
  bcThumbnail,
  resolveBcArticle,
  type BialoCzerwoniArticle,
} from '@/lib/bialoCzerwoniApi'
import type { ApiLineup } from '@/types/api.types'
import type { Spiel, SpielEreignis, SpielStatistiken } from '@/types/spiel.types'

type TabKey = 'summary' | 'statistics' | 'lineups' | 'news'

interface SpielDetailTabsProps {
  spiel: Spiel
  statistiken: SpielStatistiken
  hasStatistics: boolean
  ereignisse: SpielEreignis[]
  lineups: ApiLineup[]
  news: BialoCzerwoniArticle[]
  locale: string
}

const statLabels: { key: keyof SpielStatistiken; label: string }[] = [
  { key: 'ballbesitz', label: 'Posiadanie piłki' },
  { key: 'torschuesse', label: 'Strzały' },
  { key: 'torschuesseAufsTor', label: 'Strzały celne' },
  { key: 'ecken', label: 'Rzuty rożne' },
  { key: 'fouls', label: 'Faule' },
  { key: 'gelbeKarten', label: 'Żółte kartki' },
  { key: 'roteKarten', label: 'Czerwone kartki' },
  { key: 'abseits', label: 'Spalone' },
  { key: 'paesse', label: 'Podania' },
  { key: 'passquote', label: 'Celne podania' },
]

function StatRow({ label, values }: { label: string; values: [number, number] }) {
  const total = values[0] + values[1]
  const homeWidth = total > 0 ? (values[0] / total) * 100 : 50
  const awayWidth = total > 0 ? (values[1] / total) * 100 : 50

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold tabular-nums text-[var(--text-main)]">{values[0]}</span>
        <span className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">{label}</span>
        <span className="font-semibold tabular-nums text-[var(--text-main)]">{values[1]}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div className="bg-[var(--accent)]" style={{ width: `${homeWidth}%` }} />
        <div className="bg-rose-500" style={{ width: `${awayWidth}%` }} />
      </div>
    </div>
  )
}

function MatchSummary({ spiel, ereignisse }: { spiel: Spiel; ereignisse: SpielEreignis[] }) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_14%,transparent),transparent_60%)] px-6 py-8">
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center gap-2 text-center">
              {spiel.team1.wappen ? <img src={spiel.team1.wappen} alt={spiel.team1.name} className="h-14 w-14 object-contain" /> : <span className="text-4xl">{spiel.team1.flagge}</span>}
              <span className="text-sm font-medium text-[var(--text-main)]">{spiel.team1.name}</span>
            </div>
            <div className="text-center">
              {spiel.ergebnis ? (
                <div className="flex items-center gap-3">
                  <span className="font-[var(--font-display)] text-5xl text-[var(--text-main)]">{spiel.ergebnis.team1}</span>
                  <span className="text-2xl text-[var(--text-muted)]">:</span>
                  <span className="font-[var(--font-display)] text-5xl text-[var(--text-main)]">{spiel.ergebnis.team2}</span>
                </div>
              ) : (
                <span className="font-[var(--font-display)] text-4xl text-[var(--accent)]">vs</span>
              )}
              <span className="mt-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                {spiel.status}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              {spiel.team2.wappen ? <img src={spiel.team2.wappen} alt={spiel.team2.name} className="h-14 w-14 object-contain" /> : <span className="text-4xl">{spiel.team2.flagge}</span>}
              <span className="text-sm font-medium text-[var(--text-main)]">{spiel.team2.name}</span>
            </div>
          </div>
        </div>
        <dl className="grid gap-4 border-t border-[var(--border)] p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-[var(--text-muted)]">Data</dt>
            <dd className="font-semibold text-[var(--text-main)]">{spiel.datum} {spiel.uhrzeit}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Stadion</dt>
            <dd className="font-semibold text-[var(--text-main)]">{spiel.stadion || 'TBD'}</dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Do przerwy</dt>
            <dd className="font-semibold text-[var(--text-main)]">
              {spiel.ergebnis?.halbzeit ? `${spiel.ergebnis.halbzeit.team1}:${spiel.ergebnis.halbzeit.team2}` : 'Brak danych'}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--text-muted)]">Sędzia</dt>
            <dd className="font-semibold text-[var(--text-main)]">{spiel.schiedsrichter || 'Nie podano'}</dd>
          </div>
        </dl>
      </Card>

      {ereignisse.length > 0 ? (
        <SpielTimeline ereignisse={ereignisse} team1Name={spiel.team1.name} team2Name={spiel.team2.name} />
      ) : (
        <Card className="text-sm text-[var(--text-muted)]">Dostawca nie zwrócił jeszcze wydarzeń dla tego meczu.</Card>
      )}
    </div>
  )
}

function StatisticsPanel({
  spiel,
  statistiken,
  hasStatistics,
}: {
  spiel: Spiel
  statistiken: SpielStatistiken
  hasStatistics: boolean
}) {
  if (!hasStatistics) {
    return (
      <Card className="p-8 text-center">
        <BarChart3 className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
        <h3 className="text-lg font-semibold text-[var(--text-main)]">Statystyki niedostępne</h3>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Dostawca danych nie zwrócił statystyk dla tego meczu. Gdy pojawią się w API, ta karta uzupełni się automatycznie.
        </p>
      </Card>
    )
  }

  return (
    <Card className="space-y-5 p-6">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        <span className="text-[var(--accent)]">{spiel.team1.kurzname}</span>
        <span className="text-rose-500">{spiel.team2.kurzname}</span>
      </div>
      {statLabels.map(({ key, label }) => (
        <StatRow key={key} label={label} values={statistiken[key]} />
      ))}
    </Card>
  )
}

function PitchLineup({ lineup }: { lineup: ApiLineup }) {
  const rows = lineup.startXI.reduce<Record<string, ApiLineup['startXI']>>((acc, player) => {
    const row = player.player.grid?.split(':')[0] || player.player.pos || 'Ławka'
    acc[row] = [...(acc[row] || []), player]
    return acc
  }, {})
  const playerPhoto = (player: ApiLineup['startXI'][number]['player']) =>
    player.photo || `https://media.api-sports.io/football/players/${player.id}.png`

  return (
    <Card className="space-y-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {lineup.team.logo && <img src={lineup.team.logo} alt={lineup.team.name} className="h-8 w-8 object-contain" />}
          <h3 className="font-semibold text-[var(--text-main)]">{lineup.team.name}</h3>
        </div>
        <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1 text-xs font-bold text-[var(--accent)]">
          {lineup.formation || '-'}
        </span>
      </div>

      <div className="pitch-frame space-y-4 p-4">
        {Object.entries(rows)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([row, players]) => (
            <div key={row} className="flex justify-around gap-2">
              {players
                .sort((a, b) => (Number(a.player.grid?.split(':')[1]) || 0) - (Number(b.player.grid?.split(':')[1]) || 0))
                .map(({ player }) => (
                  <div key={player.id} className="max-w-[104px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-2 text-center shadow-[var(--shadow-soft)]">
                    <div className="relative mx-auto mb-1 h-10 w-10">
                      <img src={playerPhoto(player)} alt={player.name} className="h-10 w-10 rounded-full border border-[var(--accent)]/50 object-cover" />
                      <span className="absolute -bottom-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-bold text-white">
                        {player.number || '?'}
                      </span>
                    </div>
                    <p className="truncate text-xs font-semibold text-[var(--text-main)]">{player.name}</p>
                    <p className="text-[10px] uppercase text-[var(--text-muted)]">{player.pos}</p>
                  </div>
                ))}
            </div>
          ))}
      </div>

      <div>
        <p className="mb-2 text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Rezerwowi</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {lineup.substitutes.map(({ player }) => (
            <div key={player.id} className="flex items-center gap-3 rounded-lg bg-[var(--surface-soft)] px-3 py-2">
              <img src={playerPhoto(player)} alt={player.name} className="h-8 w-8 rounded-full border border-[var(--border)] object-cover" />
              <span className="w-7 text-xs font-bold text-[var(--accent)]">{player.number || '-'}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-[var(--text-main)]">{player.name}</span>
              <span className="text-xs text-[var(--text-muted)]">{player.pos}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function LineupsPanel({ lineups }: { lineups: ApiLineup[] }) {
  if (lineups.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        Dostawca danych nie zwrócił składów dla tego meczu.
      </Card>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {lineups.map((lineup) => (
        <PitchLineup key={lineup.team.id} lineup={lineup} />
      ))}
    </div>
  )
}

function NewsPanel({ news, locale }: { news: BialoCzerwoniArticle[]; locale: string }) {
  if (news.length === 0) {
    return (
      <Card className="p-8 text-center text-sm text-[var(--text-muted)]">
        Brak powiązanych artykułów CMS dla zespołów z tego meczu.
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {news.map((article) => {
        const resolved = resolveBcArticle(article, locale)
        const thumb = bcThumbnail(article)

        return (
          <Link key={article._id} href={`/wiadomosc/${article.slug}`} className="group block">
            <Card className="card-hover h-full overflow-hidden p-0">
              {thumb && <img src={thumb} alt={resolved.title} className="h-44 w-full object-cover" />}
              <div className="space-y-3 p-5">
                <span className="badge-gold">{bcPrimaryCategory(article)}</span>
                <h3 className="line-clamp-2 text-lg text-[var(--text-main)] transition group-hover:text-[var(--accent)]">
                  {resolved.title}
                </h3>
                <p className="line-clamp-2 text-sm text-[var(--text-muted)]">{resolved.summary || resolved.description}</p>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

export function SpielDetailTabs({
  spiel,
  statistiken,
  hasStatistics,
  ereignisse,
  lineups,
  news,
  locale,
}: SpielDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('summary')
  const tabs = [
    { key: 'summary' as const, label: 'Podsumowanie', icon: FileText },
    { key: 'statistics' as const, label: 'Statystyki', icon: BarChart3 },
    { key: 'lineups' as const, label: 'Składy', icon: Users },
    { key: 'news' as const, label: 'News', icon: Newspaper },
  ]

  return (
    <section className="space-y-5">
      <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-[var(--shadow-soft)]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              activeTab === tab.key
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-main)]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.key === 'news' && news.length > 0 && (
              <span className="rounded-full bg-white/20 px-1.5 text-[10px]">{news.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && <MatchSummary spiel={spiel} ereignisse={ereignisse} />}
      {activeTab === 'statistics' && (
        <StatisticsPanel spiel={spiel} statistiken={statistiken} hasStatistics={hasStatistics} />
      )}
      {activeTab === 'lineups' && <LineupsPanel lineups={lineups} />}
      {activeTab === 'news' && <NewsPanel news={news} locale={locale} />}

      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <CalendarClock className="h-3.5 w-3.5" />
        Dane meczowe są odświeżane z API po stronie serwera.
      </div>
    </section>
  )
}
