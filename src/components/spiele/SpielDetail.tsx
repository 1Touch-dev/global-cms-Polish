'use client'

import { useTranslations } from 'next-intl'
import type { Spiel, SpielStatistiken } from '@/types/spiel.types'

interface SpielDetailProps {
  spiel: Spiel
  statistiken: SpielStatistiken
}

function StatBar({ label, values }: { label: string; values: [number, number] }) {
  const total = values[0] + values[1]
  const pct1 = total > 0 ? (values[0] / total) * 100 : 50
  const pct2 = total > 0 ? (values[1] / total) * 100 : 50

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium tabular-nums text-[var(--text-main)]">{values[0]}</span>
        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{label}</span>
        <span className="font-medium tabular-nums text-[var(--text-main)]">{values[1]}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full">
        <div className="rounded-l-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${pct1}%` }} />
        <div className="rounded-r-full bg-rose-500 transition-all duration-500" style={{ width: `${pct2}%` }} />
      </div>
    </div>
  )
}

export function SpielDetail({ spiel, statistiken }: SpielDetailProps) {
  const t = useTranslations('spiel')

  const statLabels: { key: keyof SpielStatistiken; label: string }[] = [
    { key: 'ballbesitz', label: t('ballbesitz') },
    { key: 'torschuesse', label: t('torschuesse') },
    { key: 'torschuesseAufsTor', label: t('aufsTor') },
    { key: 'ecken', label: t('ecken') },
    { key: 'fouls', label: t('fouls') },
    { key: 'gelbeKarten', label: t('gelbeKarten') },
    { key: 'roteKarten', label: t('roteKarten') },
    { key: 'abseits', label: t('abseits') },
    { key: 'paesse', label: t('paesse') },
    { key: 'passquote', label: t('passquote') },
  ]

  return (
    <div className="glass-card overflow-hidden">
      <div className="bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--accent)_12%,transparent),transparent_60%)] px-6 py-8">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{spiel.team1.flagge}</span>
            <span className="text-sm font-medium text-[var(--text-main)]">{spiel.team1.name}</span>
          </div>

          <div className="text-center">
            {spiel.ergebnis ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="font-[var(--font-display)] text-5xl text-[var(--text-main)]">
                    {spiel.ergebnis.team1}
                  </span>
                  <span className="text-2xl text-[var(--text-muted)]">:</span>
                  <span className="font-[var(--font-display)] text-5xl text-[var(--text-main)]">
                    {spiel.ergebnis.team2}
                  </span>
                </div>
                {spiel.ergebnis.halbzeit && (
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">
                    ({t('halbzeit')} {spiel.ergebnis.halbzeit.team1}:{spiel.ergebnis.halbzeit.team2})
                  </span>
                )}
              </>
            ) : (
              <span className="font-[var(--font-display)] text-4xl text-[var(--accent)]">vs</span>
            )}
            <div className="mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  spiel.status === 'Live'
                    ? 'bg-rose-500 text-white'
                    : spiel.status === 'Beendet'
                    ? 'bg-[var(--surface-soft)] text-[var(--text-secondary)]'
                    : 'border border-[var(--accent)] text-[var(--accent)]'
                }`}
              >
                {spiel.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{spiel.team2.flagge}</span>
            <span className="text-sm font-medium text-[var(--text-main)]">{spiel.team2.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        <h3 className="mb-4 text-center font-[var(--font-display)] text-lg uppercase tracking-wide text-[var(--accent)]">
          {t('statistiken')}
        </h3>

        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[var(--accent)]" />
            <span className="text-xs text-[var(--text-secondary)]">{spiel.team1.kurzname}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-secondary)]">{spiel.team2.kurzname}</span>
            <span className="h-3 w-3 rounded-full bg-rose-500" />
          </div>
        </div>

        {statLabels.map(({ key, label }) => (
          <StatBar key={key} label={label} values={statistiken[key]} />
        ))}
      </div>
    </div>
  )
}
