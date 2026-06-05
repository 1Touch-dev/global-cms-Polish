'use client'

import { useTranslations } from 'next-intl'
import { Circle, ArrowRightLeft } from 'lucide-react'
import type { SpielEreignis } from '@/types/spiel.types'

interface SpielTimelineProps {
  ereignisse: SpielEreignis[]
  team1Name: string
  team2Name: string
}

function EreignisIcon({ typ }: { typ: SpielEreignis['typ'] }) {
  switch (typ) {
    case 'Tor':
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15">
          <span className="text-xs">⚽</span>
        </div>
      )
    case 'Eigentor':
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-500/60 bg-rose-500/15">
          <span className="text-xs">⚽</span>
        </div>
      )
    case 'GelbeKarte':
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-amber-500/60 bg-amber-500/15">
          <div className="h-4 w-3 rounded-sm bg-amber-400" />
        </div>
      )
    case 'RoteKarte':
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-500/60 bg-rose-500/15">
          <div className="h-4 w-3 rounded-sm bg-rose-500" />
        </div>
      )
    case 'Wechsel':
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-500/15">
          <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-400" />
        </div>
      )
    default:
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
          <Circle className="h-3 w-3 text-[var(--text-muted)]" />
        </div>
      )
  }
}

export function SpielTimeline({ ereignisse, team1Name, team2Name }: SpielTimelineProps) {
  const t = useTranslations('spiel')
  const sorted = [...ereignisse].sort((a, b) => a.minute - b.minute)

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
        <h3 className="font-[var(--font-display)] text-center text-lg uppercase tracking-wide text-[var(--accent)]">
          {t('spielverlauf')}
        </h3>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="text-[var(--accent)]">{team1Name}</span>
          <span className="text-rose-400">{team2Name}</span>
        </div>

        <div className="relative">
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[var(--border)]" />
          <div className="space-y-4">
            {sorted.map((ereignis, idx) => {
              const isTeam1 = ereignis.team === team1Name
              return (
                <div key={idx} className={`flex items-center gap-3 ${isTeam1 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${isTeam1 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block rounded-lg px-3 py-1.5 ${isTeam1 ? 'bg-[var(--accent)]/6' : 'bg-rose-500/6'}`}>
                      <p className="text-sm font-medium text-[var(--text-main)]">{ereignis.spieler}</p>
                      {ereignis.details && <p className="text-xs text-[var(--text-muted)]">{ereignis.details}</p>}
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-col items-center gap-0.5">
                    <EreignisIcon typ={ereignis.typ} />
                    <span className="text-xs font-medium text-[var(--text-muted)]">{ereignis.minute}&apos;</span>
                  </div>

                  <div className="flex-1" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{t('halbzeit')}</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
      </div>
    </div>
  )
}
