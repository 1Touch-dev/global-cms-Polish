'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { LigaNav } from '@/components/ligen/LigaNav'
import { LigaTabelle } from '@/components/ligen/LigaTabelle'
import { SpielKarte } from '@/components/wm/SpielKarte'
import { FadeInSection } from '@/components/ui/PageTransition'
import { LigaTabellePlatz, TabellenZone } from '@/types/liga.types'
import { Spiel } from '@/types/spiel.types'
import { BarChart3, Calendar, Award, Clock } from 'lucide-react'

interface TopScorer {
  rang: number
  name: string
  photo?: string
  nationalitaet: string
  verein: string
  vereinLogo?: string
  tore: number
  vorlagen: number
  spiele: number
}

interface LigaConfig {
  apiId: string
  season: string
  name: string
  flag: string
}

interface LigaPageClientProps {
  ligaSlug: string
  config: LigaConfig
  tabelle: LigaTabellePlatz[]
  zones: TabellenZone[]
  topScorer: TopScorer[]
  recentFixtures: Spiel[]
  ligaLogo?: string
  saison: string
}

export default function LigaPageClient({
  ligaSlug,
  config,
  tabelle,
  zones,
  topScorer,
  recentFixtures,
  ligaLogo,
  saison,
}: LigaPageClientProps) {
  const t = useTranslations('ligen')
  const [activeTab, setActiveTab] = useState<'tabelle' | 'torschuetzen' | 'spiele'>('tabelle')

  const tabs = [
    { id: 'tabelle' as const, label: t('tabelle'), icon: BarChart3 },
    { id: 'torschuetzen' as const, label: t('torschuetzen'), icon: Award },
    { id: 'spiele' as const, label: t('spiele'), icon: Calendar },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        {ligaLogo ? (
          <img src={ligaLogo} alt={config.name} className="w-12 h-12 object-contain" />
        ) : (
          <span className="text-4xl">{config.flag}</span>
        )}
        <div>
          <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
            {config.flag} {config.name.toUpperCase()}
          </h1>
          <p className="text-(--color-text-muted) text-sm mt-0.5">{t('saison', { from: saison, to: parseInt(saison) + 1 })}</p>
        </div>
      </div>

      {/* Liga Nav */}
      <div className="mb-6">
        <LigaNav aktiv={ligaSlug} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-(--color-border) pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--color-aka)] text-black'
                : 'text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-white/5'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabelle Tab */}
      {activeTab === 'tabelle' && (
        <FadeInSection>
          {tabelle.length > 0 ? (
            <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) overflow-hidden">
              <LigaTabelle tabelle={tabelle} zonen={zones} />
            </div>
          ) : (
            <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
              <BarChart3 className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
              <p className="text-(--color-text-muted)">{t('tabelle_laden')}</p>
              <p className="text-(--color-text-secondary) text-sm mt-1">{t('daten_laden')}</p>
            </div>
          )}
        </FadeInSection>
      )}

      {/* Top Scorers Tab */}
      {activeTab === 'torschuetzen' && (
        <FadeInSection>
          {topScorer.length > 0 ? (
            <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_130px_60px_60px_60px] px-4 py-2 border-b border-(--color-border) text-xs text-(--color-text-muted) font-medium uppercase tracking-wider">
                <span>#</span>
                <span>{t('spieler_header')}</span>
                <span>{t('verein_header')}</span>
                <span className="text-center">{t('tore_header')}</span>
                <span className="text-center">{t('vorlagen_header')}</span>
                <span className="text-center">{t('spiele_header')}</span>
              </div>
              {topScorer.map((spieler, i) => (
                <div
                  key={spieler.rang}
                  className={`grid grid-cols-[40px_1fr_130px_60px_60px_60px] px-4 py-3 items-center hover:bg-white/5 transition-colors ${
                    i < topScorer.length - 1 ? 'border-b border-(--color-border)/50' : ''
                  }`}
                >
                  <span className={`text-sm font-bold ${spieler.rang <= 3 ? 'text-[var(--color-aka)]' : 'text-(--color-text-muted)'}`}>
                    {spieler.rang}
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    {spieler.photo ? (
                      <img src={spieler.photo} alt={spieler.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-(--color-border)" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-(--color-surface-1) shrink-0 flex items-center justify-center text-xs text-(--color-text-muted)">⚽</div>
                    )}
                    <div className="min-w-0">
                      <p className="text-(--color-text-primary) font-medium text-sm truncate">{spieler.name}</p>
                      <p className="text-(--color-text-secondary) text-xs">{spieler.nationalitaet}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 min-w-0">
                    {spieler.vereinLogo && (
                      <img src={spieler.vereinLogo} alt={spieler.verein} className="w-4 h-4 object-contain shrink-0" />
                    )}
                    <span className="text-(--color-text-muted) text-xs truncate">{spieler.verein}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[var(--color-aka)] font-bold text-base">{spieler.tore}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-(--color-text-secondary) text-sm">{spieler.vorlagen}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-(--color-text-muted) text-sm">{spieler.spiele}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
              <Award className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
              <p className="text-(--color-text-muted)">{t('torschuetzen_laden')}</p>
            </div>
          )}
        </FadeInSection>
      )}

      {/* Spiele Tab */}
      {activeTab === 'spiele' && (
        <FadeInSection>
          {recentFixtures.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentFixtures.map(spiel => (
                <SpielKarte key={spiel.id} spiel={spiel} />
              ))}
            </div>
          ) : (
            <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
              <Clock className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
              <p className="text-(--color-text-muted)">{t('keine_spiele')}</p>
            </div>
          )}
        </FadeInSection>
      )}
    </div>
  )
}
