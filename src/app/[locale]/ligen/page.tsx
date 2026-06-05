'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Trophy } from 'lucide-react'

const ligen = [
  { id: 'bundesliga', name: 'Bundesliga', land: '🇩🇪', beschreibung: 'Deutsche Fußball-Bundesliga' },
  { id: 'champions-league', name: 'Champions League', land: '🇪🇺', beschreibung: 'UEFA Champions League' },
  { id: 'premier-league', name: 'Premier League', land: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', beschreibung: 'English Premier League' },
  { id: 'la-liga', name: 'La Liga', land: '🇪🇸', beschreibung: 'Primera División de España' },
  { id: 'serie-a', name: 'Serie A', land: '🇮🇹', beschreibung: 'Serie A TIM Italia' },
  { id: 'ligue-1', name: 'Ligue 1', land: '🇫🇷', beschreibung: 'Ligue 1 Uber Eats' },
]

export default function LigenPage() {
  const t = useTranslations()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Trophy className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          LIGEN
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">Die besten Fußball-Ligen der Welt</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ligen.map(liga => (
          <Link key={liga.id} href={`/ligen/${liga.id}`}>
            <div className="bg-[var(--color-grau)] rounded-xl p-6 border border-(--color-border) card-hover h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{liga.land}</span>
                <div>
                  <h3 className="text-(--color-text-primary) font-semibold text-lg">{liga.name}</h3>
                  <p className="text-(--color-text-muted) text-sm">{liga.beschreibung}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-(--color-border)">
                <span className="text-[var(--color-aka)] text-sm font-medium">
                  Tabelle ansehen →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
