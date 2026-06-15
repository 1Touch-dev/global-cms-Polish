'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import {
  ArrowLeft, Shield, Trophy, Users, TrendingUp, Swords, BarChart3, MapPin, Calendar, Maximize2
} from 'lucide-react'
import { FadeInSection } from '@/components/ui/PageTransition'
import { SpielKarte } from '@/components/wm/SpielKarte'
import { NewsSection } from '@/components/news/NewsSection'
import { Spiel } from '@/types/spiel.types'

type TabType = 'kader' | 'spielplan' | 'statistiken' | 'h2h'

interface ApiTeamData {
  team: {
    id: number
    name: string
    kurzname: string
    flagge: string
    wappen?: string
    land: string
    gruppe?: string
    stadion?: string
    stadionBild?: string
    stadionKapazitaet?: number
    gruendung?: number
  } | null
  spiele: Spiel[]
  kader: Record<string, { id: number; nr: number; name: string; alter: number; photo: string; position: string }[]>
  standingRow: any
  gruppe: string
}

interface MockTeam {
  id: number
  name: string
  kurzname: string
  flagge: string
  wappen?: string
  punkte: number
  spiele: number
  siege: number
  unentschieden: number
  niederlagen: number
  tore: number
  gegentore: number
  tordifferenz: number
  form: string[]
  gruppe: string
  gruppenTeams: any[]
}

interface Props {
  teamId: string
  apiData: ApiTeamData | null
  mockTeam: MockTeam | null
}

export default function TeamDetailClient({ teamId, apiData, mockTeam }: Props) {
  const t = useTranslations('teams')
  const locale = useLocale()
  const [activeTab, setActiveTab] = useState<TabType>('kader')

  const teamName = apiData?.team?.name || mockTeam?.name || '—'
  const teamFlagge = apiData?.team?.flagge || mockTeam?.flagge || ''
  const teamWappen = apiData?.team?.wappen || mockTeam?.wappen
  const teamKurzname = apiData?.team?.kurzname || mockTeam?.kurzname || ''
  const gruppe = apiData?.gruppe || mockTeam?.gruppe || ''

  const stadion = apiData?.team?.stadion
  const stadionBild = apiData?.team?.stadionBild
  const stadionKapazitaet = apiData?.team?.stadionKapazitaet
  const gruendung = apiData?.team?.gruendung

  const standing = apiData?.standingRow
  const punkte = standing?.points ?? mockTeam?.punkte ?? 0
  const spiele = standing?.all?.played ?? mockTeam?.spiele ?? 0
  const siege = standing?.all?.win ?? mockTeam?.siege ?? 0
  const unentschieden = standing?.all?.draw ?? mockTeam?.unentschieden ?? 0
  const niederlagen = standing?.all?.lose ?? mockTeam?.niederlagen ?? 0
  const tore = standing?.all?.goals?.for ?? mockTeam?.tore ?? 0
  const gegentore = standing?.all?.goals?.against ?? mockTeam?.gegentore ?? 0
  const tordifferenz = standing?.goalsDiff ?? mockTeam?.tordifferenz ?? (tore - gegentore)
  const form: string[] = standing?.form
    ? standing.form.split('').map((f: string) => f === 'W' ? 'S' : f === 'D' ? 'U' : 'N')
    : mockTeam?.form || []

  const apiFixtures = apiData?.spiele || []
  const kader = apiData?.kader || {}
  const hasRealKader = Object.keys(kader).length > 0

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'kader', label: t('tab_kader'), icon: <Users className="w-4 h-4" /> },
    { key: 'spielplan', label: t('tab_spielplan'), icon: <Swords className="w-4 h-4" /> },
    { key: 'statistiken', label: t('tab_statistiken'), icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'h2h', label: t('tab_h2h'), icon: <TrendingUp className="w-4 h-4" /> },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Link href="/teams" className="inline-flex items-center gap-2 text-(--color-text-muted) hover:text-[#FFCC00] transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('alle_mannschaften')}
      </Link>

      {/* Team Header */}
      <FadeInSection>
        <div className="bg-(--color-surface-1) rounded-2xl p-8 border border-(--color-border) hover:border-[#FFCC00]/30 transition-all">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {teamWappen ? (
              <img src={teamWappen} alt={teamName} className="w-24 h-24 object-contain" />
            ) : (
              <span className="text-7xl">{teamFlagge}</span>
            )}
            <div className="flex-1">
              <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-(--color-text-primary) mb-3 uppercase">
                {teamName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {gruppe && (
                  <span className="inline-flex items-center gap-1.5 bg-[#FFCC00]/10 text-[#FFCC00] px-3 py-1 rounded-full text-sm font-semibold border border-[#FFCC00]/20">
                    <Shield className="w-3.5 h-3.5" />
                    {t('gruppe_label', { gruppe })}
                  </span>
                )}
                <span className="text-(--color-text-muted) text-sm">{teamKurzname}</span>
                {apiData?.team?.land && (
                  <span className="text-(--color-text-muted) text-sm">{apiData.team.land}</span>
                )}
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-1">{t('punkte')}</p>
              <p className="text-4xl font-bold text-[#FFCC00]">{punkte}</p>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Stadium */}
      {(stadionBild || stadion) && (
        <FadeInSection>
          <div className="bg-(--color-surface-1) rounded-2xl border border-(--color-border) overflow-hidden hover:border-[#FFCC00]/30 transition-all">
            {stadionBild && (
              <div className="relative w-full h-52 md:h-72">
                <img
                  src={stadionBild}
                  alt={stadion || 'Stadion'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
              </div>
            )}
            <div className="p-5 flex flex-wrap items-center gap-6">
              {stadion && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                  <div>
                    <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-0.5">{t('stadion')}</p>
                    <p className="text-(--color-text-primary) font-semibold">{stadion}</p>
                  </div>
                </div>
              )}
              {stadionKapazitaet && stadionKapazitaet > 0 && (
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                  <div>
                    <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-0.5">{t('kapazitaet')}</p>
                    <p className="text-(--color-text-primary) font-semibold">{stadionKapazitaet.toLocaleString('de-DE')}</p>
                  </div>
                </div>
              )}
              {gruendung && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#FFCC00] flex-shrink-0" />
                  <div>
                    <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-0.5">{t('gegruendet')}</p>
                    <p className="text-(--color-text-primary) font-semibold">{gruendung}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Quick Stats */}
      <FadeInSection>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { label: t('spiele_stats'), wert: spiele, farbe: 'text-(--color-text-primary)' },
            { label: t('siege'), wert: siege, farbe: 'text-green-400' },
            { label: t('unentschieden'), wert: unentschieden, farbe: 'text-yellow-400' },
            { label: t('niederlagen'), wert: niederlagen, farbe: 'text-[#DD0000]' },
            { label: t('tore'), wert: tore, farbe: 'text-[#FFCC00]' },
            { label: t('gegentore'), wert: gegentore, farbe: 'text-(--color-text-secondary)' },
          ].map((stat) => (
            <div key={stat.label} className="bg-(--color-surface-1) rounded-xl p-4 border border-(--color-border) text-center hover:border-[#FFCC00]/30 transition-all">
              <p className={`text-2xl font-bold ${stat.farbe}`}>{stat.wert}</p>
              <p className="text-(--color-text-muted) text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Tabs */}
      <FadeInSection>
        <div className="flex gap-1 bg-(--color-surface-1) p-1.5 rounded-xl border border-(--color-border) overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#FFCC00] text-black shadow-lg shadow-[#FFCC00]/20'
                  : 'text-(--color-text-muted) hover:text-(--color-text-primary) hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </FadeInSection>

      {/* Tab Content */}
      <div className="min-h-[400px]">

        {/* Kader Tab */}
        {activeTab === 'kader' && (
          <FadeInSection>
            {hasRealKader ? (
              <div className="space-y-8">
                {Object.entries(kader).map(([position, spieler]) => (
                  <div key={position}>
                    <h3 className="font-[var(--font-display)] text-lg text-[#FFCC00] mb-4 uppercase tracking-wider">
                      {position}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {spieler.map((s) => (
                        <Link key={s.id} href={`/spieler/${s.id}`}>
                          <div className="bg-(--color-surface-1) rounded-xl p-4 border border-(--color-border) hover:border-[#FFCC00]/40 transition-all flex items-center gap-4 group cursor-pointer">
                            <div className="relative w-12 h-12 flex-shrink-0">
                              {s.photo ? (
                                <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-full object-cover border-2 border-(--color-border) group-hover:border-[#FFCC00]/50 transition-colors" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFCC00]/20 to-[#DD0000]/20 border-2 border-(--color-border) group-hover:border-[#FFCC00]/50 flex items-center justify-center text-(--color-text-primary) font-bold text-lg transition-colors">
                                  {s.nr || '?'}
                                </div>
                              )}
                              {s.nr > 0 && (
                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FFCC00] text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                                  {s.nr}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-(--color-text-primary) font-semibold truncate group-hover:text-[#FFCC00] transition-colors">{s.name}</p>
                              {s.alter > 0 && (
                                <p className="text-(--color-text-muted) text-xs mt-0.5">{t('alter_jahre', { alter: s.alter })}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-(--color-surface-1) rounded-xl border border-(--color-border)">
                <Users className="w-12 h-12 text-(--color-text-secondary) mx-auto mb-4" />
                <p className="text-(--color-text-muted)">{t('kader_nicht_verfuegbar')}</p>
                <p className="text-(--color-text-secondary) text-sm mt-1">{t('keine_spieler')}</p>
              </div>
            )}
          </FadeInSection>
        )}

        {/* Spielplan Tab */}
        {activeTab === 'spielplan' && (
          <FadeInSection>
            {apiFixtures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apiFixtures.map(spiel => (
                  <SpielKarte key={spiel.id} spiel={spiel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-(--color-surface-1) rounded-xl border border-(--color-border)">
                <Swords className="w-12 h-12 text-(--color-text-secondary) mx-auto mb-4" />
                <p className="text-(--color-text-muted)">{t('keine_spiele')}</p>
              </div>
            )}
          </FadeInSection>
        )}

        {/* Statistiken Tab */}
        {activeTab === 'statistiken' && (
          <FadeInSection>
            <div className="bg-(--color-surface-1) rounded-2xl p-6 border border-(--color-border) space-y-8">
              <h3 className="font-[var(--font-display)] text-lg text-[#FFCC00] uppercase tracking-wider">
                {t('turnierstatistiken')}
              </h3>

              <div className="space-y-4">
                {[
                  { label: t('tore'), wert: tore, max: Math.max(tore, gegentore, 1), color: 'from-green-600 to-green-400' },
                  { label: t('gegentore'), wert: gegentore, max: Math.max(tore, gegentore, 1), color: 'from-[#DD0000] to-red-400' },
                  { label: t('siege'), wert: siege, max: Math.max(spiele, 1), color: 'from-[#FFCC00] to-yellow-400' },
                  { label: t('niederlagen'), wert: niederlagen, max: Math.max(spiele, 1), color: 'from-gray-600 to-gray-400' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-(--color-text-muted)">{item.label}</span>
                      <span className="text-(--color-text-primary) font-bold">{item.wert}</span>
                    </div>
                    <div className="h-3 bg-(--color-surface-1) rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`}
                        style={{ width: `${Math.min(100, (item.wert / item.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-(--color-border)">
                <span className="text-(--color-text-muted) text-sm">{t('tordifferenz')}</span>
                <span className={`text-2xl font-bold ${tordifferenz > 0 ? 'text-green-400' : tordifferenz < 0 ? 'text-[#DD0000]' : 'text-(--color-text-muted)'}`}>
                  {tordifferenz > 0 ? '+' : ''}{tordifferenz}
                </span>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* H2H Tab */}
        {activeTab === 'h2h' && (
          <FadeInSection>
            <div className="text-center py-16 bg-(--color-surface-1) rounded-xl border border-(--color-border)">
              <TrendingUp className="w-12 h-12 text-(--color-text-secondary) mx-auto mb-4" />
              <p className="text-(--color-text-muted)">{t('h2h_daten')}</p>
              <p className="text-(--color-text-secondary) text-sm mt-1">{t('vergleich_laden')}</p>
            </div>
          </FadeInSection>
        )}
      </div>

      {/* Form */}
      {form.length > 0 && (
        <FadeInSection>
          <div className="bg-(--color-surface-1) rounded-2xl p-6 border border-(--color-border)">
            <h3 className="font-[var(--font-display)] text-lg text-[#FFCC00] mb-4 uppercase tracking-wider">
              {t('aktuelle_form')}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-(--color-text-muted) text-sm mr-2">{t('letzte_spiele')}</span>
              {form.slice(-5).map((f, i) => (
                <span
                  key={i}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 ${
                    f === 'S'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : f === 'U'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-[#DD0000]/20 text-[#DD0000] border border-[#DD0000]/30'
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </FadeInSection>
      )}

      {/* Trophy info from standing */}
      {standing?.description && (
        <FadeInSection>
          <div className="bg-(--color-surface-1) rounded-2xl p-4 border border-(--color-border) flex items-center gap-3">
            <Trophy className="w-5 h-5 text-[#FFCC00]" />
            <span className="text-(--color-text-secondary) text-sm">{standing.description}</span>
          </div>
        </FadeInSection>
      )}

      {/* News */}
      <FadeInSection>
        <NewsSection titel={t('nachrichten')} source="teams" maxArtikel={3} kompakt teamNames={[teamName]} />
      </FadeInSection>
    </div>
  )
}
