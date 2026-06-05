'use client'

import { useLocale, useTranslations } from 'next-intl'

export function LiveBadge() {
  const locale = useLocale()
  const label = locale === 'en' ? 'LIVE' : 'NA ZYWO'

  return (
    <span className="badge-red">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations('spiel')

  const isLive = status === 'Live' || status === '1H' || status === '2H' || status === 'ET' || status === 'P' || status === 'BT'
  const isHalbzeit = status === 'HT' || status === 'Halbzeit'
  const isBeendet = status === 'FT' || status === 'AET' || status === 'PEN' || status === 'Beendet'
  const isVerschoben = status === 'PST' || status === 'SUSP' || status === 'ABD' || status === 'Verschoben'

  if (isLive) return <LiveBadge />

  const label = isHalbzeit ? t('halbzeit')
    : isBeendet ? t('beendet')
    : isVerschoben ? t('verschoben')
    : t('geplant')

  const styleClass = isHalbzeit ? 'bg-[var(--accent)] text-black'
    : isBeendet ? 'bg-[var(--surface-2)] text-[var(--text-muted)]'
    : isVerschoben ? 'bg-[var(--surface-2)] text-[var(--text-muted)]'
    : 'border border-[var(--accent)] text-[var(--accent)]'

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${styleClass}`}>
      {label}
    </span>
  )
}
