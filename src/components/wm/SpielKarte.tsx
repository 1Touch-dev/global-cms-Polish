'use client'

import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Calendar, Clock } from 'lucide-react'
import type { Spiel } from '@/types/spiel.types'

interface SpielKarteProps {
  spiel: Spiel
}

export function SpielKarte({ spiel }: SpielKarteProps) {
  const t = useTranslations('wm')
  const tSpiel = useTranslations('spiel')
  const locale = useLocale()

  const statusConfig = {
    Live: { style: { background: '#C8102E', color: '#fff' }, label: 'LIVE', pulse: true },
    Halbzeit: { style: { background: 'rgba(200,16,46,0.8)', color: '#fff' }, label: tSpiel('halbzeit'), pulse: true },
    Beendet: { style: { background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }, label: tSpiel('beendet'), pulse: false },
    Geplant: { style: { background: 'var(--color-gold-muted)', color: 'var(--color-gold)', border: '1px solid var(--color-border-gold)' }, label: tSpiel('geplant'), pulse: false },
    Verschoben: { style: { background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.4)' }, label: tSpiel('verschoben'), pulse: false },
  }

  const status = statusConfig[spiel.status]

  const formatDatum = (datum: string) => {
    const date = new Date(datum)
    return date.toLocaleDateString(locale, { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div
      className="rounded-xl overflow-hidden group transition-all duration-250 card-hover"
      style={{
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-elevated)',
        }}
      >
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDatum(spiel.datum)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {spiel.uhrzeit}
          </span>
        </div>
        <div
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
          style={status.style as React.CSSProperties}
        >
          {status.pulse && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
            </span>
          )}
          {status.label}
        </div>
      </div>

      {/* Match body */}
      <div className="px-4 py-5">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {spiel.team1.wappen ? (
              <img src={spiel.team1.wappen} alt={spiel.team1.name} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-3xl">{spiel.team1.flagge}</span>
            )}
            <span className="text-sm font-semibold text-center" style={{ color: 'var(--color-text-primary)' }}>
              {spiel.team1.kurzname}
            </span>
          </div>

          {/* Score / VS */}
          <div className="shrink-0 mx-4 text-center">
            {spiel.ergebnis ? (
              <div className="flex items-center gap-2">
                <span className="font-(--font-display) text-3xl" style={{ color: 'var(--color-text-primary)' }}>{spiel.ergebnis.team1}</span>
                <span className="text-lg" style={{ color: 'var(--color-text-muted)' }}>–</span>
                <span className="font-(--font-display) text-3xl" style={{ color: 'var(--color-text-primary)' }}>{spiel.ergebnis.team2}</span>
              </div>
            ) : (
              <span className="font-(--font-display) text-xl" style={{ color: 'var(--color-gold)' }}>vs</span>
            )}
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {spiel.team2.wappen ? (
              <img src={spiel.team2.wappen} alt={spiel.team2.name} className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-3xl">{spiel.team2.flagge}</span>
            )}
            <span className="text-sm font-semibold text-center" style={{ color: 'var(--color-text-primary)' }}>
              {spiel.team2.kurzname}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-4 py-2 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        <span className="flex items-center gap-1 truncate">
          <MapPin className="w-3 h-3 shrink-0" />
          {spiel.stadion}, {spiel.stadt}
        </span>
        <span className="font-semibold shrink-0 ml-2" style={{ color: 'var(--color-gold)' }}>
          {spiel.gruppe ? `${t('gruppe')} ${spiel.gruppe}` : spiel.runde}
        </span>
      </div>
    </div>
  )
}
