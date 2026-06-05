'use client'

import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

const ligen = [
  { id: 'bundesliga', name: 'Bundesliga', land: '🇩🇪', code: 'BL1' },
  { id: 'champions-league', name: 'Champions League', land: '🇪🇺', code: 'CL' },
  { id: 'premier-league', name: 'Premier League', land: '🇬🇧', code: 'PL' },
  { id: 'la-liga', name: 'La Liga', land: '🇪🇸', code: 'PD' },
  { id: 'serie-a', name: 'Serie A', land: '🇮🇹', code: 'SA' },
  { id: 'ligue-1', name: 'Ligue 1', land: '🇫🇷', code: 'FL1' },
]

export function LigaNav({ aktiv }: { aktiv?: string }) {
  const t = useTranslations('nav')

  return (
    <nav className="flex flex-wrap gap-2 mb-6">
      {ligen.map((liga) => (
        <Link
          key={liga.id}
          href={`/ligen/${liga.id}`}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            aktiv === liga.id
              ? 'bg-[var(--color-aka)] text-black'
              : 'bg-[var(--color-grau)] text-(--color-text-secondary) hover:text-[var(--color-aka)] border border-(--color-border)'
          }`}
        >
          <span>{liga.land}</span>
          <span>{liga.name}</span>
        </Link>
      ))}
    </nav>
  )
}
