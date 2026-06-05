'use client'

import { useTranslations } from 'next-intl'
import { GruppenTabelle } from '@/components/wm/GruppenTabelle'
import { Gruppe } from '@/types/wm.types'
import { useState } from 'react'

interface GruppenPageClientProps {
  gruppen: Gruppe[]
}

export default function GruppenPageClient({ gruppen }: GruppenPageClientProps) {
  const t = useTranslations('gruppen')
  const [selectedGruppe, setSelectedGruppe] = useState<string | null>(null)

  const gezeigt = selectedGruppe
    ? gruppen.filter(g => g.name === selectedGruppe)
    : gruppen

  const totalTeams = gruppen.reduce((a, g) => a + g.teams.length, 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide mb-2">
        {t('titel')}
      </h1>
      <p className="text-(--color-text-muted) mb-8">
        {t('untertitel', { gruppen: gruppen.length, mannschaften: totalTeams })}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedGruppe(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !selectedGruppe ? 'bg-[var(--color-aka)] text-black' : 'bg-[var(--color-grau)] text-(--color-text-secondary) border border-(--color-border) hover:border-[var(--color-aka)]'
          }`}
        >
          {t('alle')}
        </button>
        {gruppen.map((g) => (
          <button
            key={g.name}
            onClick={() => setSelectedGruppe(g.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedGruppe === g.name ? 'bg-[var(--color-aka)] text-black' : 'bg-[var(--color-grau)] text-(--color-text-secondary) border border-(--color-border) hover:border-[var(--color-aka)]'
            }`}
          >
            {t('gruppe', { name: g.name })}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {gezeigt.map((gruppe) => (
          <GruppenTabelle key={gruppe.name} gruppe={gruppe} />
        ))}
      </div>
    </div>
  )
}
