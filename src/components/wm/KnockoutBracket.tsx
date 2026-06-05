'use client'

import { useTranslations } from 'next-intl'
import { Trophy } from 'lucide-react'
import type { KORundeSpiel } from '@/types/wm.types'

interface KnockoutBracketProps {
  spiele: KORundeSpiel[]
}

function BracketMatchCard({ spiel }: { spiel: KORundeSpiel }) {
  return (
    <div className="glass-card w-full min-w-[180px] overflow-hidden transition-colors hover:border-[var(--accent)]/30">
      <div
        className={`flex items-center justify-between border-b border-[var(--border)]/50 px-3 py-2 ${
          spiel.ergebnis && spiel.ergebnis.team1 > spiel.ergebnis.team2 ? 'bg-[var(--accent)]/6' : ''
        }`}
      >
        <span className="max-w-[120px] truncate text-sm text-[var(--text-main)]">
          {spiel.team1 ?? 'TBD'}
        </span>
        <span className="ml-2 font-[var(--font-display)] text-base text-[var(--text-main)]">
          {spiel.ergebnis?.team1 ?? '-'}
        </span>
      </div>
      <div
        className={`flex items-center justify-between px-3 py-2 ${
          spiel.ergebnis && spiel.ergebnis.team2 > spiel.ergebnis.team1 ? 'bg-[var(--accent)]/6' : ''
        }`}
      >
        <span className="max-w-[120px] truncate text-sm text-[var(--text-main)]">
          {spiel.team2 ?? 'TBD'}
        </span>
        <span className="ml-2 font-[var(--font-display)] text-base text-[var(--text-main)]">
          {spiel.ergebnis?.team2 ?? '-'}
        </span>
      </div>
    </div>
  )
}

export function KnockoutBracket({ spiele }: KnockoutBracketProps) {
  const t = useTranslations('wm')

  const runden: KORundeSpiel['runde'][] = ['Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale']
  const rundenLabels: Record<string, string> = {
    Achtelfinale: t('achtelfinale'),
    Viertelfinale: t('viertelfinale'),
    Halbfinale: t('halbfinale'),
    Finale: t('finale'),
  }

  const spieleByRunde = runden.map((runde) => ({
    runde,
    label: rundenLabels[runde],
    spiele: spiele.filter((s) => s.runde === runde),
  }))

  return (
    <div className="w-full overflow-x-auto">
      <div className="hidden min-w-max items-start gap-6 px-4 py-8 lg:flex">
        {spieleByRunde.map((rundeGroup, roundIdx) => (
          <div key={rundeGroup.runde} className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-2">
              {rundeGroup.runde === 'Finale' && <Trophy className="h-4 w-4 text-[var(--accent)]" />}
              <h4 className="font-[var(--font-display)] text-sm uppercase tracking-wider text-[var(--accent)]">
                {rundeGroup.label}
              </h4>
            </div>
            <div
              className="flex flex-col justify-around gap-4"
              style={{ minHeight: `${Math.pow(2, runden.length - roundIdx) * 48}px` }}
            >
              {rundeGroup.spiele.map((spiel) => (
                <BracketMatchCard key={spiel.id} spiel={spiel} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-8 px-4 py-6 lg:hidden">
        {spieleByRunde.map((rundeGroup) => (
          <div key={rundeGroup.runde}>
            <div className="mb-3 flex items-center gap-2">
              {rundeGroup.runde === 'Finale' && <Trophy className="h-4 w-4 text-[var(--accent)]" />}
              <h4 className="font-[var(--font-display)] text-sm uppercase tracking-wider text-[var(--accent)]">
                {rundeGroup.label}
              </h4>
              <div className="h-px flex-1 bg-[var(--border)]" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rundeGroup.spiele.map((spiel) => (
                <BracketMatchCard key={spiel.id} spiel={spiel} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
