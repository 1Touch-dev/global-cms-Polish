'use client'

import { useTranslations } from 'next-intl'
import { Spiel } from '@/types/spiel.types'
import { SpielKarte } from '@/components/wm/SpielKarte'
import { Activity, Clock, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { FadeInSection } from '@/components/ui/PageTransition'
import { Link } from '@/i18n/routing'

interface SpielePageProps {
  liveSpiele: Spiel[]
  upcomingSpiele: Spiel[]
  pastSpiele: Spiel[]
}

export default function SpielePageClient({ liveSpiele, upcomingSpiele, pastSpiele }: SpielePageProps) {
  const t = useTranslations('spiel')
  const tAllg = useTranslations('allgemein')
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>(
    liveSpiele.length > 0 ? 'live' : 'upcoming'
  )

  const tabs = [
    { id: 'live' as const, label: t('live'), icon: Activity, count: liveSpiele.length },
    { id: 'upcoming' as const, label: t('anpfiff'), icon: Clock, count: upcomingSpiele.length },
    { id: 'past' as const, label: t('beendet'), icon: CheckCircle, count: pastSpiele.length },
  ]

  const currentSpiele = activeTab === 'live' ? liveSpiele : activeTab === 'upcoming' ? upcomingSpiele : pastSpiele

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {tAllg('live')}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 mt-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--color-aka)] text-black'
                : 'bg-[var(--color-grau)] text-(--color-text-secondary) border border-(--color-border) hover:border-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold ${
                activeTab === tab.id ? 'bg-(--color-surface-elevated) text-black' : 'bg-(--color-surface-2) text-(--color-text-secondary)'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Spiele Grid */}
      <FadeInSection>
        {currentSpiele.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSpiele.map(spiel => (
              <Link key={spiel.id} href={`/spiele/${spiel.id}`} className="block">
                <SpielKarte spiel={spiel} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
            <Activity className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
            <p className="text-(--color-text-muted) text-lg">{tAllg('keineDaten')}</p>
            <p className="text-(--color-text-secondary) text-sm mt-1">{tAllg('laden')}</p>
          </div>
        )}
      </FadeInSection>
    </div>
  )
}
