'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { Gamepad2, Trophy, Target, TrendingUp, Users, Zap, ChevronRight } from 'lucide-react'
import { FadeInSection } from '@/components/ui/PageTransition'

interface VorhersageSpiel {
  id: number
  team1: { name: string; flagge: string; kurzname: string }
  team2: { name: string; flagge: string; kurzname: string }
  gruppe: string
  datum: string
  uhrzeit: string
  stadion: string
}

const BESTENLISTE = [
  { rang: 1, name: 'FußballKönig23', punkte: 47, richtig: 12 },
  { rang: 2, name: 'WM_Prophet', punkte: 43, richtig: 11 },
  { rang: 3, name: 'TorJäger99', punkte: 38, richtig: 9 },
  { rang: 4, name: 'BundesligaFan', punkte: 35, richtig: 8 },
  { rang: 5, name: 'GoldenerSchuh', punkte: 32, richtig: 7 },
]

interface Props {
  naechsteSpiele: VorhersageSpiel[]
}

export default function VorhersagePageClient({ naechsteSpiele }: Props) {
  const t = useTranslations('vorhersage')
  const locale = useLocale()
  const [predictions, setPredictions] = useState<Record<number, { team1: number; team2: number }>>({})
  const [submitted, setSubmitted] = useState<Set<number>>(new Set())
  const [meineGesamtpunkte] = useState(0)
  const [activeTab, setActiveTab] = useState<'vorhersagen' | 'bestenliste' | 'regeln'>('vorhersagen')

  const updateScore = (spielId: number, team: 'team1' | 'team2', delta: number) => {
    if (submitted.has(spielId)) return
    setPredictions(prev => {
      const current = prev[spielId] || { team1: 0, team2: 0 }
      return { ...prev, [spielId]: { ...current, [team]: Math.max(0, current[team] + delta) } }
    })
  }

  const submitPrediction = (spielId: number) => {
    setSubmitted(prev => new Set(prev).add(spielId))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Gamepad2 className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {t('titel')}
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">{t('beschreibung')}</p>

      <FadeInSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Trophy className="w-5 h-5 text-[var(--color-aka)] mx-auto mb-1" />
            <p className="text-2xl font-bold text-[var(--color-aka)]">{meineGesamtpunkte}</p>
            <p className="text-(--color-text-muted) text-xs">{t('gesamtpunkte')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-400">{submitted.size}</p>
            <p className="text-(--color-text-muted) text-xs">{t('tipps_abgegeben')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-400">{naechsteSpiele.length}</p>
            <p className="text-(--color-text-muted) text-xs">{t('offene_spiele')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Users className="w-5 h-5 text-(--color-text-muted) mx-auto mb-1" />
            <p className="text-2xl font-bold text-(--color-text-primary)">—</p>
            <p className="text-(--color-text-muted) text-xs">{t('platzierung')}</p>
          </div>
        </div>
      </FadeInSection>

      <div className="flex gap-2 mb-6 border-b border-(--color-border) pb-2">
        {[
          { id: 'vorhersagen' as const, label: t('tab_vorhersagen'), icon: Zap },
          { id: 'bestenliste' as const, label: t('tab_bestenliste'), icon: Trophy },
          { id: 'regeln' as const, label: t('tab_regeln'), icon: Target },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[var(--color-aka)]/10 text-[var(--color-aka)] border-b-2 border-[var(--color-aka)]'
                : 'text-(--color-text-muted) hover:text-(--color-text-primary)'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'vorhersagen' && (
        <FadeInSection>
          {naechsteSpiele.length === 0 ? (
            <div className="text-center py-16 bg-[var(--color-grau)] rounded-xl border border-(--color-border)">
              <Gamepad2 className="w-12 h-12 text-(--color-text-secondary) mx-auto mb-4" />
              <p className="text-(--color-text-muted)">{t('keine_spiele')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {naechsteSpiele.map(spiel => {
                const pred = predictions[spiel.id] || { team1: 0, team2: 0 }
                const isSubmitted = submitted.has(spiel.id)

                return (
                  <div key={spiel.id} className={`bg-[var(--color-grau)] rounded-xl border transition-all ${isSubmitted ? 'border-green-500/30' : 'border-(--color-border) hover:border-[var(--color-aka)]/30'}`}>
                    <div className="px-4 py-2 border-b border-(--color-border)/50 flex items-center justify-between text-xs text-(--color-text-muted)">
                      <span>{new Date(spiel.datum).toLocaleDateString(locale, { day: 'numeric', month: 'long' })} • {new Date(spiel.uhrzeit).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[var(--color-aka)]">{spiel.gruppe} • {spiel.stadion}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-center flex-1">
                          <span className="text-4xl block mb-1">{spiel.team1.flagge || '🏳️'}</span>
                          <p className="text-(--color-text-primary) font-semibold text-sm">{spiel.team1.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateScore(spiel.id, 'team1', -1)} disabled={isSubmitted} className="w-8 h-8 rounded bg-(--color-surface-2) text-(--color-text-primary) flex items-center justify-center hover:bg-(--color-surface-2) disabled:opacity-40">-</button>
                          <span className="text-3xl font-bold text-(--color-text-primary) w-10 text-center font-[var(--font-display)]">{pred.team1}</span>
                          <button onClick={() => updateScore(spiel.id, 'team1', 1)} disabled={isSubmitted} className="w-8 h-8 rounded bg-(--color-surface-2) text-(--color-text-primary) flex items-center justify-center hover:bg-(--color-surface-2) disabled:opacity-40">+</button>
                          <span className="text-(--color-text-muted) mx-3 text-xl">:</span>
                          <button onClick={() => updateScore(spiel.id, 'team2', -1)} disabled={isSubmitted} className="w-8 h-8 rounded bg-(--color-surface-2) text-(--color-text-primary) flex items-center justify-center hover:bg-(--color-surface-2) disabled:opacity-40">-</button>
                          <span className="text-3xl font-bold text-(--color-text-primary) w-10 text-center font-[var(--font-display)]">{pred.team2}</span>
                          <button onClick={() => updateScore(spiel.id, 'team2', 1)} disabled={isSubmitted} className="w-8 h-8 rounded bg-(--color-surface-2) text-(--color-text-primary) flex items-center justify-center hover:bg-(--color-surface-2) disabled:opacity-40">+</button>
                        </div>
                        <div className="text-center flex-1">
                          <span className="text-4xl block mb-1">{spiel.team2.flagge || '🏳️'}</span>
                          <p className="text-(--color-text-primary) font-semibold text-sm">{spiel.team2.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => submitPrediction(spiel.id)}
                        disabled={isSubmitted}
                        className={`w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          isSubmitted
                            ? 'bg-green-600/20 text-green-400 border border-green-500/30 cursor-not-allowed'
                            : 'bg-[var(--color-aka)] text-(--color-text-primary) hover:bg-red-700'
                        }`}
                      >
                        {isSubmitted ? t('tipp_abgegeben') : t('tipp_abgeben')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </FadeInSection>
      )}

      {activeTab === 'bestenliste' && (
        <FadeInSection>
          <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) overflow-hidden">
            <div className="px-4 py-3 border-b border-(--color-border) flex items-center justify-between text-xs text-(--color-text-muted)">
              <span>{t('spieler_header')}</span>
              <div className="flex gap-8">
                <span>{t('richtig_header')}</span>
                <span>{t('punkte_header')}</span>
              </div>
            </div>
            {BESTENLISTE.map((spieler, i) => (
              <div key={spieler.rang} className={`flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${i < BESTENLISTE.length - 1 ? 'border-b border-(--color-border)/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    spieler.rang === 1 ? 'bg-[var(--color-aka)]/20 text-[var(--color-aka)]' :
                    spieler.rang === 2 ? 'bg-gray-400/20 text-(--color-text-secondary)' :
                    spieler.rang === 3 ? 'bg-orange-400/20 text-orange-400' : 'bg-(--color-surface-1) text-(--color-text-muted)'
                  }`}>{spieler.rang}</span>
                  <span className="text-(--color-text-primary) font-medium text-sm">{spieler.name}</span>
                </div>
                <div className="flex gap-8 items-center">
                  <span className="text-(--color-text-muted) text-sm w-12 text-center">{spieler.richtig}</span>
                  <span className="text-[var(--color-aka)] font-bold w-12 text-center">{spieler.punkte}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>
      )}

      {activeTab === 'regeln' && (
        <FadeInSection>
          <div className="bg-[var(--color-grau)] rounded-xl p-6 border border-(--color-border)">
            <h3 className="font-[var(--font-display)] text-xl text-[var(--color-aka)] mb-4">{t('punktesystem')}</h3>
            <div className="space-y-4">
              {[
                { icon: '🎯', punkte: 5, label: t('exakt_ergebnis'), beispiel: '' },
                { icon: '👍', punkte: 3, label: t('richtige_tendenz_td'), beispiel: '' },
                { icon: '✓', punkte: 2, label: t('richtige_tendenz'), beispiel: '' },
                { icon: '❌', punkte: 0, label: t('falsch'), beispiel: '' },
              ].map(regel => (
                <div key={regel.label} className="flex items-start gap-4 p-3 rounded-lg bg-(--color-surface-elevated)">
                  <span className="text-2xl">{regel.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-(--color-text-primary) font-medium">{regel.label}</span>
                      <span className="text-[var(--color-aka)] font-bold">{t('pkt', { pts: regel.punkte })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-[var(--color-aka)]/5 border border-[var(--color-aka)]/20">
              <h4 className="text-[var(--color-aka)] font-semibold text-sm mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Bonus
              </h4>
              <ul className="text-(--color-text-muted) text-sm space-y-1">
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[var(--color-aka)]" /> {t('ko_multiplikator')}</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[var(--color-aka)]" /> {t('finale_multiplikator')}</li>
                <li className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-[var(--color-aka)]" /> {t('bonus_5')}</li>
              </ul>
            </div>
          </div>
        </FadeInSection>
      )}
    </div>
  )
}
