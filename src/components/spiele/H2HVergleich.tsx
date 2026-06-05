'use client'

import { useTranslations } from 'next-intl'
import type { H2HVergleich as H2HVergleichType } from '@/types/spiel.types'

interface H2HVergleichProps {
  data: H2HVergleichType
}

export function H2HVergleich({ data }: H2HVergleichProps) {
  const t = useTranslations('spiel')
  const totalMatches = data.team1Siege + data.unentschieden + data.team2Siege
  const pctTeam1 = totalMatches > 0 ? (data.team1Siege / totalMatches) * 100 : 0
  const pctDraw = totalMatches > 0 ? (data.unentschieden / totalMatches) * 100 : 0
  const pctTeam2 = totalMatches > 0 ? (data.team2Siege / totalMatches) * 100 : 0

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
        <h3 className="font-[var(--font-display)] text-center text-lg uppercase tracking-wide text-[var(--accent)]">
          {t('h2h')}
        </h3>
      </div>

      <div className="px-6 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-center">
            <span className="font-[var(--font-display)] text-3xl text-[var(--accent)]">{data.team1Siege}</span>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{data.team1}</p>
          </div>
          <div className="text-center">
            <span className="font-[var(--font-display)] text-2xl text-[var(--text-muted)]">{data.unentschieden}</span>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{t('unentschieden')}</p>
          </div>
          <div className="text-center">
            <span className="font-[var(--font-display)] text-3xl text-rose-400">{data.team2Siege}</span>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{data.team2}</p>
          </div>
        </div>

        <div className="mb-2 flex h-3 overflow-hidden rounded-full">
          {pctTeam1 > 0 && <div className="bg-[var(--accent)] transition-all" style={{ width: `${pctTeam1}%` }} />}
          {pctDraw > 0 && <div className="bg-[var(--border)] transition-all" style={{ width: `${pctDraw}%` }} />}
          {pctTeam2 > 0 && <div className="bg-rose-500 transition-all" style={{ width: `${pctTeam2}%` }} />}
        </div>
        <p className="mb-6 text-center text-xs text-[var(--text-muted)]">
          {data.gesamtSpiele} {t('gesamtSpiele')} • {t('toreBilanz')}: {data.toreTeam1} - {data.toreTeam2}
        </p>

        <h4 className="mb-3 text-sm uppercase tracking-wider text-[var(--text-muted)]">
          {t('letzteBegegnungen')}
        </h4>
        <div className="space-y-2">
          {data.letzteSpiele.slice(0, 5).map((spiel, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-2"
            >
              <div className="flex flex-col">
                <span className="text-xs text-[var(--text-muted)]">{spiel.datum}</span>
                <span className="text-xs text-[var(--text-secondary)]">{spiel.wettbewerb}</span>
              </div>
              <span className="font-[var(--font-display)] text-sm text-[var(--text-main)]">{spiel.ergebnis}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  spiel.sieger === data.team1
                    ? 'bg-[var(--accent)]/12 text-[var(--accent)]'
                    : spiel.sieger === data.team2
                    ? 'bg-rose-500/12 text-rose-400'
                    : 'bg-[var(--surface)] text-[var(--text-muted)]'
                }`}
              >
                {spiel.sieger ?? t('unentschieden')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
