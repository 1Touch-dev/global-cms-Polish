'use client'

import { useTranslations } from 'next-intl'
import { WM_STADIEN, Stadion } from '@/lib/stadien-data'
import { StadionInfo } from '@/components/stadien/StadionInfo'
import { MapPin, List, Map } from 'lucide-react'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FadeInSection, StaggerContainer, StaggerItem } from '@/components/ui/PageTransition'
import { NewsSection } from '@/components/news/NewsSection'

const StadionMap = dynamic(
  () => import('@/components/stadien/StadionMapClient'),
  { ssr: false, loading: () => <div className="w-full h-[500px] bg-[var(--color-grau)] rounded-xl animate-pulse flex items-center justify-center"><MapPin className="w-8 h-8 text-(--color-text-secondary)" /></div> }
)

export default function StadienPage() {
  const t = useTranslations('stadien')
  const [filterLand, setFilterLand] = useState<string | null>(null)
  const [view, setView] = useState<'map' | 'grid'>('map')
  const [selectedStadion, setSelectedStadion] = useState<Stadion | null>(null)

  const stadien = filterLand
    ? WM_STADIEN.filter(s => s.land === filterLand)
    : WM_STADIEN

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <MapPin className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {t('titel')}
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">{t('untertitel')}</p>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: null, label: t('alle') },
            { id: 'USA', label: '🇺🇸 ' + t('usa') + ' (11)' },
            { id: 'Mexiko', label: '🇲🇽 ' + t('mexiko') + ' (3)' },
            { id: 'Kanada', label: '🇨🇦 ' + t('kanada') + ' (2)' },
          ].map(f => (
            <button
              key={f.id || 'all'}
              onClick={() => setFilterLand(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterLand === f.id ? 'bg-[var(--color-aka)] text-black' : 'bg-[var(--color-grau)] text-(--color-text-secondary) border border-(--color-border) hover:border-[var(--color-aka)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-[var(--color-grau)] rounded-lg p-1 border border-(--color-border)">
          <button
            onClick={() => setView('map')}
            className={`p-2 rounded-md transition-colors ${view === 'map' ? 'bg-[var(--color-aka)] text-black' : 'text-(--color-text-muted)'}`}
          >
            <Map className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md transition-colors ${view === 'grid' ? 'bg-[var(--color-aka)] text-black' : 'text-(--color-text-muted)'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map View */}
      {view === 'map' && (
        <div className="mb-8">
          <StadionMap stadien={stadien} onSelect={setSelectedStadion} />
          {selectedStadion && (
            <div className="mt-4 max-w-sm">
              <StadionInfo stadion={selectedStadion} />
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <FadeInSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stadien.map(stadion => (
              <StaggerItem key={stadion.id}>
                <StadionInfo stadion={stadion} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </FadeInSection>
      )}

      {/* Summary */}
      <div className="mt-8 bg-[var(--color-grau)] rounded-xl p-6 border border-(--color-border)">
        <h3 className="font-[var(--font-display)] text-lg text-[var(--color-aka)] mb-3">{t('zusammenfassung')}</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-(--color-text-primary)">{WM_STADIEN.filter(s => s.land === 'USA').length}</p>
            <p className="text-(--color-text-muted) text-xs">🇺🇸 USA</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-(--color-text-primary)">{WM_STADIEN.filter(s => s.land === 'Mexiko').length}</p>
            <p className="text-(--color-text-muted) text-xs">🇲🇽 Mexiko</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-(--color-text-primary)">{WM_STADIEN.filter(s => s.land === 'Kanada').length}</p>
            <p className="text-(--color-text-muted) text-xs">🇨🇦 Kanada</p>
          </div>
        </div>
      </div>

      {/* News */}
      <div className="mt-8">
        <NewsSection titel={t('news_titel')} source="stadiums" maxArtikel={3} kompakt />
      </div>
    </div>
  )
}
