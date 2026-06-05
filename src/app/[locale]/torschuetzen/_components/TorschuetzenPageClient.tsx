'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Award, Target, TrendingUp, Zap } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { FadeInSection } from '@/components/ui/PageTransition'

interface Torschuetze {
  rang: number
  name: string
  photo?: string
  nationalitaet: string
  verein: string
  vereinLogo?: string
  position: string
  tore: number
  vorlagen: number
  spiele: number
  minutenProTor: number
  schuesse: number
  trefferquote: number
  elfmeter: number
}

interface TorschuetzenPageProps {
  torschuetzen: Torschuetze[]
}

export default function TorschuetzenPageClient({ torschuetzen }: TorschuetzenPageProps) {
  const t = useTranslations('torschuetzen')
  const [sortBy, setSortBy] = useState<'tore' | 'minutenProTor' | 'trefferquote'>('tore')

  const totalGoals = torschuetzen.reduce((sum, t) => sum + t.tore, 0)
  const totalGames = torschuetzen.length > 0 ? torschuetzen[0].spiele : 0
  const totalPenalties = torschuetzen.reduce((sum, t) => sum + t.elfmeter, 0)
  const bestMinPerGoal = torschuetzen.length > 0 ? Math.min(...torschuetzen.filter(t => t.minutenProTor > 0).map(t => t.minutenProTor)) : 0

  const sorted = [...torschuetzen].sort((a, b) => {
    if (sortBy === 'tore') return b.tore - a.tore
    if (sortBy === 'minutenProTor') return (a.minutenProTor || 999) - (b.minutenProTor || 999)
    return b.trefferquote - a.trefferquote
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Award className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {t('titel')}
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">{t('untertitel')}</p>

      {/* Stats Cards */}
      <FadeInSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Target className="w-5 h-5 text-[var(--color-aka)] mx-auto mb-1" />
            <p className="text-2xl font-bold text-[var(--color-aka)]">{totalGoals}</p>
            <p className="text-(--color-text-muted) text-xs">{t('gesamtore')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <TrendingUp className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-400">
              {totalGames > 0 ? (totalGoals / totalGames).toFixed(2) : '0'}
            </p>
            <p className="text-(--color-text-muted) text-xs">{t('tore_pro_spiel')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Zap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-400">{totalPenalties}</p>
            <p className="text-(--color-text-muted) text-xs">{t('elfmeter_tore')}</p>
          </div>
          <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) text-center">
            <Award className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-400">{bestMinPerGoal || '—'}</p>
            <p className="text-(--color-text-muted) text-xs">{t('min_pro_tor')}</p>
          </div>
        </div>
      </FadeInSection>

      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-end gap-2 mb-6">
        {[
          { id: 'tore' as const, label: t('sort_tore') },
          { id: 'minutenProTor' as const, label: t('sort_min') },
          { id: 'trefferquote' as const, label: t('sort_quote') },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setSortBy(s.id)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              sortBy === s.id ? 'bg-white/10 text-(--color-text-primary)' : 'text-(--color-text-muted) hover:text-(--color-text-secondary)'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      {sorted.length >= 3 && (
        <FadeInSection delay={0.05}>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {sorted.slice(0, 3).map((spieler, i) => (
              <Link key={spieler.rang} href={`/spieler/${spieler.rang}`}>
                <div className={`bg-[var(--color-grau)] rounded-xl p-5 border text-center hover:border-[var(--color-aka)]/40 transition-all ${
                  i === 0 ? 'border-[var(--color-aka)]/30 ring-1 ring-[var(--color-aka)]/10' : 'border-(--color-border)'
                }`}>
                  <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                    i === 0 ? 'bg-[var(--color-aka)]/20 text-[var(--color-aka)]' :
                    i === 1 ? 'bg-gray-400/20 text-(--color-text-secondary)' :
                    'bg-orange-400/20 text-orange-400'
                  }`}>
                    {i + 1}
                  </div>
                  {spieler.photo ? (
                    <img src={spieler.photo} alt={spieler.name} className="w-14 h-14 rounded-full mx-auto mb-2 object-cover" />
                  ) : (
                    <span className="text-3xl block mb-2">⚽</span>
                  )}
                  <h3 className="text-(--color-text-primary) font-bold text-sm">{spieler.name}</h3>
                  <p className="text-(--color-text-muted) text-xs flex items-center justify-center gap-1">
                    {spieler.vereinLogo && <img src={spieler.vereinLogo} alt={spieler.verein} className="w-3.5 h-3.5 object-contain" />}
                    {spieler.verein}
                  </p>
                  <p className="text-3xl font-bold text-[var(--color-aka)] mt-2 font-[var(--font-display)]">{spieler.tore}</p>
                  <p className="text-(--color-text-muted) text-xs">{t('tore_in_spielen', { goals: spieler.tore, matches: spieler.spiele })}</p>
                </div>
              </Link>
            ))}
          </div>
        </FadeInSection>
      )}

      {/* Full Table */}
      <FadeInSection delay={0.1}>
        <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) overflow-hidden">
          <div className="hidden md:grid grid-cols-[40px_1fr_100px_60px_60px_80px_80px_70px] px-4 py-2 border-b border-(--color-border) text-xs text-(--color-text-muted) font-medium">
            <span>#</span>
            <span>{t('spieler_header')}</span>
            <span>{t('verein_header')}</span>
            <span className="text-center">{t('tore_header')}</span>
            <span className="text-center">{t('vorlagen_header')}</span>
            <span className="text-center">{t('min_tor_header')}</span>
            <span className="text-center">{t('schuesse_header')}</span>
            <span className="text-center">{t('quote_header')}</span>
          </div>

          {sorted.length > 0 ? sorted.map((spieler, i) => (
            <Link key={spieler.rang} href={`/spieler/${spieler.rang}`}>
              <div className={`grid grid-cols-[40px_1fr_100px_60px_60px_80px_80px_70px] px-4 py-3 items-center hover:bg-white/5 transition-colors ${i < sorted.length - 1 ? 'border-b border-(--color-border)/50' : ''}`}>
                <span className={`text-sm font-bold ${spieler.rang <= 3 ? 'text-[var(--color-aka)]' : 'text-(--color-text-muted)'}`}>{spieler.rang}</span>
                <div className="flex items-center gap-2 min-w-0">
                  {spieler.photo ? (
                    <img src={spieler.photo} alt={spieler.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <span className="text-lg flex-shrink-0">⚽</span>
                  )}
                  <div className="min-w-0">
                    <p className="text-(--color-text-primary) font-medium text-sm truncate">{spieler.name}</p>
                    <p className="text-(--color-text-secondary) text-xs">{spieler.nationalitaet}</p>
                  </div>
                </div>
                <span className="text-(--color-text-muted) text-xs truncate flex items-center gap-1">
                  {spieler.vereinLogo && <img src={spieler.vereinLogo} alt={spieler.verein} className="w-4 h-4 object-contain flex-shrink-0" />}
                  {spieler.verein}
                </span>
                <div className="text-center">
                  <span className="text-[var(--color-aka)] font-bold">{spieler.tore}</span>
                </div>
                <div className="text-center">
                  <span className="text-(--color-text-secondary) text-sm">{spieler.vorlagen}</span>
                </div>
                <div className="text-center">
                  <span className="text-(--color-text-secondary) text-sm">{spieler.minutenProTor > 0 ? `${spieler.minutenProTor}'` : '—'}</span>
                </div>
                <div className="text-center">
                  <span className="text-(--color-text-muted) text-sm">{spieler.schuesse}</span>
                </div>
                <div className="text-center">
                  <div className="relative w-full bg-(--color-surface-1) rounded-full h-1.5">
                    <div className="bg-[var(--color-aka)] h-1.5 rounded-full" style={{ width: `${spieler.trefferquote}%` }} />
                  </div>
                  <span className="text-(--color-text-muted) text-[10px]">{spieler.trefferquote}%</span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="p-8 text-center text-(--color-text-muted)">{t('keine_daten')}</div>
          )}
        </div>
      </FadeInSection>
    </div>
  )
}
