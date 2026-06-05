'use client'

import { useTranslations } from 'next-intl'
import { SpielerKarte } from '@/components/spieler/SpielerKarte'
import { Spieler } from '@/types/spieler.types'
import { useState } from 'react'
import { User, Filter } from 'lucide-react'

interface SpielerPageProps {
  spieler: Spieler[]
}

export default function SpielerPageClient({ spieler }: SpielerPageProps) {
  const t = useTranslations()
  const tSpieler = useTranslations('spieler')
  const [filterPosition, setFilterPosition] = useState<string | null>(null)

  const positions = [
    { label: t('allgemein.alle'), value: null },
    { label: tSpieler('torwart'), value: 'Goalkeeper' },
    { label: tSpieler('abwehr'), value: 'Defender' },
    { label: tSpieler('mittelfeld'), value: 'Midfielder' },
    { label: tSpieler('sturm'), value: 'Attacker' },
  ]

  const filtered = filterPosition
    ? spieler.filter(s => s.position === filterPosition)
    : spieler

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <User className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {tSpieler('titel')}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 mt-4">
        <Filter className="w-4 h-4 text-(--color-text-muted)" />
        {positions.map(pos => (
          <button
            key={pos.label}
            onClick={() => setFilterPosition(pos.value)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filterPosition === pos.value
                ? 'bg-[var(--color-aka)] text-black'
                : 'bg-[var(--color-grau)] text-(--color-text-secondary) border border-(--color-border)'
            }`}
          >
            {pos.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(s => (
            <SpielerKarte key={s.id} spieler={s} />
          ))}
        </div>
      ) : (
        <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
          <User className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
          <p className="text-(--color-text-muted)">{tSpieler('keine_spieler')}</p>
        </div>
      )}
    </div>
  )
}
