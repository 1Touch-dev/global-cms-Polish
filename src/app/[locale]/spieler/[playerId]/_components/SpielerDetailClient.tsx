'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, Target, Zap, Activity, Shield, Award, User } from 'lucide-react'
import { FadeInSection } from '@/components/ui/PageTransition'
import { NewsSection, getNewsCollections } from '@/components/news/NewsSection'

interface Props {
  playerId: string
  playerData: any | null
}

function positionColor(pos: string): string {
  if (pos === 'Goalkeeper') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  if (pos === 'Defender') return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (pos === 'Midfielder') return 'bg-[var(--color-aka)]/20 text-[var(--color-aka)] border-[var(--color-aka)]/30'
  return 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function SpielerDetailClient({ playerId, playerData }: Props) {
  const t = useTranslations('spieler')
  const tAllg = useTranslations('allgemein')
  const locale = useLocale()
  const news = getNewsCollections(locale)
  const [activeTab, setActiveTab] = useState<'stats' | 'karriere'>('stats')

  function mapPosition(pos: string): string {
    const map: Record<string, string> = {
      Goalkeeper: t('torwart'),
      Defender: t('abwehr'),
      Midfielder: t('mittelfeld'),
      Attacker: t('sturm'),
    }
    return map[pos] || pos || '—'
  }

  if (!playerData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <User className="w-16 h-16 text-(--color-text-secondary) mx-auto mb-4" />
        <p className="text-(--color-text-muted) text-lg">{t('nicht_gefunden')}</p>
        <p className="text-(--color-text-secondary) text-sm mt-1">ID: {playerId}</p>
        <Link href="/spieler" className="text-[var(--color-aka)] mt-4 inline-block hover:underline">
          ← {t('alle_spieler')}
        </Link>
      </div>
    )
  }

  const player = playerData.player
  const stats = playerData.statistics || []
  const mainStat = stats[0] || {}

  const name = player?.name || '—'
  const photo = player?.photo || ''
  const nationality = player?.nationality || '—'
  const age = player?.age || 0
  const height = player?.height || '—'
  const weight = player?.weight || '—'
  const injured = player?.injured || false

  const position = mainStat?.games?.position || '—'
  const club = mainStat?.team?.name || '—'
  const clubLogo = mainStat?.team?.logo || ''
  const jerseyNum = mainStat?.games?.number

  const goals = mainStat?.goals?.total || 0
  const assists = mainStat?.goals?.assists || 0
  const appearances = mainStat?.games?.appearences || 0
  const minutes = mainStat?.games?.minutes || 0
  const yellowCards = mainStat?.cards?.yellow || 0
  const redCards = mainStat?.cards?.red || 0
  const shots = mainStat?.shots?.total || 0
  const shotsOnTarget = mainStat?.shots?.on || 0
  const passAccuracy = mainStat?.passes?.accuracy || 0
  const dribbleSuccess = mainStat?.dribbles?.success || 0
  const dribbleAttempts = mainStat?.dribbles?.attempts || 0
  const duelsWon = mainStat?.duels?.won || 0
  const duelsTotal = mainStat?.duels?.total || 0
  const foulsDrawn = mainStat?.fouls?.drawn || 0
  const foulsCommitted = mainStat?.fouls?.committed || 0
  const penaltyScored = mainStat?.penalty?.scored || 0
  const rating = mainStat?.games?.rating ? parseFloat(mainStat.games.rating).toFixed(1) : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/spieler" className="inline-flex items-center gap-2 text-(--color-text-muted) hover:text-[var(--color-aka)] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t('alle_spieler')}
      </Link>

      {/* Hero */}
      <FadeInSection>
        <div className="bg-gradient-to-r from-[var(--color-grau)] to-black rounded-xl p-6 border border-(--color-border) mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-aka)]/5 rounded-full blur-3xl" />
          <div className="flex items-start gap-5 relative z-10">
            <div className="relative">
              {photo ? (
                <img src={photo} alt={name} className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-aka)]/30" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-3xl font-bold text-[var(--color-aka)] border-2 border-[var(--color-aka)]/30">
                  {jerseyNum || name[0]}
                </div>
              )}
              {injured && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-(--color-text-primary) text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  {t('verletzt')}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-[var(--font-display)] text-3xl md:text-4xl text-(--color-text-primary)">{name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`text-xs px-2.5 py-1 rounded border ${positionColor(position)}`}>
                  {mapPosition(position)}
                </span>
                {clubLogo ? (
                  <img src={clubLogo} alt={club} className="w-5 h-5 object-contain" />
                ) : null}
                <span className="text-(--color-text-muted) text-sm">{club}</span>
                <span className="text-(--color-text-secondary) text-sm">•</span>
                <span className="text-(--color-text-muted) text-sm">{nationality}</span>
                {rating && (
                  <span className="text-xs px-2.5 py-1 rounded bg-[var(--color-aka)]/10 text-[var(--color-aka)] border border-[var(--color-aka)]/20 font-bold">
                    ⭐ {rating}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Bio bar */}
      <FadeInSection delay={0.05}>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: t('alter'), value: age ? `${age} J.` : '—' },
            { label: t('groesse'), value: height },
            { label: t('gewicht'), value: weight },
            { label: t('trikotNummer'), value: jerseyNum ? `#${jerseyNum}` : '—' },
            { label: t('nationalitaet'), value: nationality },
          ].map(info => (
            <div key={info.label} className="bg-[var(--color-grau)] rounded-lg p-3 border border-(--color-border) text-center">
              <p className="text-(--color-text-primary) font-semibold text-sm truncate">{info.value}</p>
              <p className="text-(--color-text-muted) text-[10px] uppercase mt-0.5">{info.label}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Key Stats */}
      <FadeInSection delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Target, label: t('tore'), value: goals, color: 'text-[var(--color-aka)]' },
            { icon: Zap, label: t('vorlagen'), value: assists, color: 'text-blue-400' },
            { icon: Activity, label: t('spiele'), value: appearances, color: 'text-(--color-text-primary)' },
            { icon: Shield, label: t('gelbe_karten'), value: yellowCards, color: 'text-yellow-400' },
            { icon: Award, label: tAllg('tore'), value: shots, color: 'text-green-400' },
            { icon: Target, label: 'Min', value: minutes, color: 'text-purple-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) hover:border-[var(--color-aka)]/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-(--color-text-muted)" />
                <span className="text-(--color-text-muted) text-xs">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </FadeInSection>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-(--color-border) mb-6">
        {[
          { id: 'stats' as const, label: t('statistiken') },
          { id: 'karriere' as const, label: t('liga_statistiken') },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === tab.id
                ? 'text-[var(--color-aka)] border-[var(--color-aka)]'
                : 'text-(--color-text-muted) border-transparent hover:text-(--color-text-primary)'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <FadeInSection>
          <div className="bg-[var(--color-grau)] rounded-xl p-6 border border-(--color-border) space-y-4">
            <h3 className="font-[var(--font-display)] text-lg text-[var(--color-aka)] mb-2">{t('detail_statistiken')}</h3>

            {[
              { label: t('schüsse_aufs_tor'), wert: shotsOnTarget, max: Math.max(shots, 1), sub: `von ${shots} gesamt` },
              { label: t('passquote' as any) || 'Pass Accuracy', wert: passAccuracy, max: 100, sub: `${passAccuracy}%`, isPercent: true },
              { label: t('dribbling'), wert: dribbleSuccess, max: Math.max(dribbleAttempts, 1), sub: `${dribbleSuccess} / ${dribbleAttempts}` },
              { label: t('zweikämpfe'), wert: duelsWon, max: Math.max(duelsTotal, 1), sub: `${duelsWon} / ${duelsTotal}` },
              { label: t('fouls_erlitten'), wert: foulsDrawn, max: Math.max(foulsDrawn + foulsCommitted, 1), sub: `${foulsCommitted}` },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-(--color-text-secondary) text-sm">{item.label}</span>
                    <span className="text-(--color-text-secondary) text-xs ml-2">{item.sub}</span>
                  </div>
                  <span className="text-(--color-text-primary) font-bold text-sm">
                    {item.isPercent ? `${item.wert}%` : item.wert}
                  </span>
                </div>
                <div className="h-2.5 bg-(--color-surface-1) rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${
                      item.isPercent && item.wert >= 85 ? 'from-[var(--color-aka)] to-yellow-300' :
                      'from-[#DD0000] via-[var(--color-aka)] to-[var(--color-aka)]'
                    }`}
                    style={{ width: `${Math.min(100, item.isPercent ? item.wert : (item.wert / item.max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}

            {penaltyScored > 0 && (
              <div className="pt-4 border-t border-(--color-border) flex items-center justify-between">
                <span className="text-(--color-text-muted) text-sm">{t('elfmeter')}</span>
                <span className="text-[var(--color-aka)] font-bold">{penaltyScored}</span>
              </div>
            )}
            {redCards > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-(--color-text-muted) text-sm">{t('rote_karten')}</span>
                <span className="text-red-400 font-bold">{redCards}</span>
              </div>
            )}
          </div>
        </FadeInSection>
      )}

      {/* Ligastatistiken Tab */}
      {activeTab === 'karriere' && (
        <FadeInSection>
          <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_40px_40px_40px_40px_40px] px-4 py-2 border-b border-(--color-border) text-xs text-(--color-text-muted)">
              <span>{t('liga_verein')}</span>
              <span className="text-center">Season</span>
              <span className="text-center">Sp</span>
              <span className="text-center">T</span>
              <span className="text-center">V</span>
              <span className="text-center">G</span>
              <span className="text-center">R</span>
            </div>
            {stats.length > 0 ? stats.map((s: any, i: number) => (
              <div key={i} className={`grid grid-cols-[1fr_80px_40px_40px_40px_40px_40px] px-4 py-3 items-center text-sm ${i < stats.length - 1 ? 'border-b border-(--color-border)/50' : ''}`}>
                <div className="flex items-center gap-2 min-w-0">
                  {s.team?.logo && <img src={s.team.logo} alt={s.team.name} className="w-5 h-5 object-contain flex-shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-(--color-text-primary) text-xs truncate">{s.team?.name}</p>
                    <p className="text-(--color-text-muted) text-[10px] truncate">{s.league?.name}</p>
                  </div>
                </div>
                <span className="text-(--color-text-muted) text-xs text-center">{s.league?.season}</span>
                <span className="text-(--color-text-primary) text-center">{s.games?.appearences || 0}</span>
                <span className="text-[var(--color-aka)] text-center font-bold">{s.goals?.total || 0}</span>
                <span className="text-center text-(--color-text-secondary)">{s.goals?.assists || 0}</span>
                <span className="text-center text-yellow-400">{s.cards?.yellow || 0}</span>
                <span className="text-center text-red-400">{s.cards?.red || 0}</span>
              </div>
            )) : (
              <div className="py-8 text-center text-(--color-text-muted) text-sm">{t('keine_liga_daten')}</div>
            )}
          </div>
        </FadeInSection>
      )}

      {/* News */}
      <div className="mt-8">
        <NewsSection titel={t('nachrichten')} news={news.players} maxArtikel={3} kompakt />
      </div>
    </div>
  )
}
