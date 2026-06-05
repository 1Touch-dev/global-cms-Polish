'use client'

import { useTranslations, useLocale } from 'next-intl'
import { SpielKarte } from '@/components/wm/SpielKarte'
import { Spiel } from '@/types/spiel.types'
import { useState } from 'react'
import { Calendar, Filter } from 'lucide-react'

interface SpielplanPageClientProps {
  spiele: Spiel[]
}

export default function SpielplanPageClient({ spiele }: SpielplanPageClientProps) {
  const t = useTranslations('spielplan')
  const locale = useLocale()
  const [filterGruppe, setFilterGruppe] = useState<string | null>(null)

  const gruppen = Array.from(new Set(spiele.map(s => s.gruppe).filter(Boolean)))

  const filteredSpiele = filterGruppe
    ? spiele.filter(s => s.gruppe === filterGruppe)
    : spiele

  const spieleByDatum = filteredSpiele.reduce<Record<string, Spiel[]>>((acc, spiel) => {
    if (!acc[spiel.datum]) acc[spiel.datum] = []
    acc[spiel.datum].push(spiel)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-(--font-display) text-4xl tracking-wide mb-2" style={{ color: 'var(--color-text-primary)' }}>
          {t('titel')}
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          {t('untertitel', { count: spiele.length })}
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Filter className="w-4 h-4 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
        <button
          onClick={() => setFilterGruppe(null)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
          style={!filterGruppe
            ? { background: 'var(--color-aka)', color: '#fff' }
            : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
        >
          {t('alle')}
        </button>
        {gruppen.map(g => (
          <button
            key={g}
            onClick={() => setFilterGruppe(g!)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={filterGruppe === g
              ? { background: 'var(--color-aka)', color: '#fff' }
              : { background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
          >
            {g}
          </button>
        ))}
      </div>

      {Object.entries(spieleByDatum).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(spieleByDatum).map(([datum, tagesSpiele]) => (
            <div key={datum}>
              {/* Date header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full" style={{ background: 'linear-gradient(180deg, var(--color-gold), var(--color-aka))' }} />
                <Calendar className="w-4 h-4" style={{ color: 'var(--color-gold)' }} />
                <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {new Date(datum).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tagesSpiele.map(spiel => (
                  <SpielKarte key={spiel.id} spiel={spiel} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl glass-card">
          <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-gold-dim)' }} />
          <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>{t('keine_spiele')}</p>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{t('wird_aktualisiert')}</p>
        </div>
      )}
    </div>
  )
}
