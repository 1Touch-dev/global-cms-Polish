'use client'

import { useTranslations } from 'next-intl'
import { BarChart3 } from 'lucide-react'
import { StatistikChart } from '@/components/statistiken/StatistikChart'
import { FadeInSection } from '@/components/ui/PageTransition'

interface StatData {
  name: string
  value: number
  fullName?: string
  photo?: string
}

interface CardData extends StatData {
  yellow?: number
  red?: number
}

interface StatistikenPageProps {
  topScorerData: StatData[]
  topAssistData: StatData[]
  topCardsData: CardData[]
}

export default function StatistikenPageClient({ topScorerData, topAssistData, topCardsData }: StatistikenPageProps) {
  const t = useTranslations('statistiken')

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {t('titel')}
        </h1>
      </div>
      <p className="text-(--color-text-muted) mb-8">{t('untertitel')}</p>

      <div className="space-y-8">
        <FadeInSection>
          {topScorerData.length > 0 ? (
            <StatistikChart
              data={topScorerData}
              title={t('torschuetzen_chart')}
              barColor="#FFCC00"
            />
          ) : (
            <div className="bg-[var(--color-grau)] rounded-xl p-8 border border-(--color-border) text-center text-(--color-text-muted)">
              {t('torschuetzen_laden')}
            </div>
          )}
        </FadeInSection>

        <FadeInSection delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {topAssistData.length > 0 ? (
              <StatistikChart
                data={topAssistData}
                title={t('vorlagen_chart')}
                barColor="#DD0000"
              />
            ) : (
              <div className="bg-[var(--color-grau)] rounded-xl p-8 border border-(--color-border) text-center text-(--color-text-muted)">
                {t('vorlagen_laden')}
              </div>
            )}
            {topCardsData.length > 0 ? (
              <StatistikChart
                data={topCardsData}
                title={t('karten_chart')}
                barColor="#FF6600"
              />
            ) : (
              <div className="bg-[var(--color-grau)] rounded-xl p-8 border border-(--color-border) text-center text-(--color-text-muted)">
                {t('karten_laden')}
              </div>
            )}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topScorerData.length > 0 && (
              <div className="bg-[var(--color-grau)] rounded-xl p-5 border border-(--color-border) card-hover">
                <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-1">{t('top_torschuetze')}</p>
                <p className="text-[var(--color-aka)] text-lg font-bold">{topScorerData[0].fullName || topScorerData[0].name} — {topScorerData[0].value}</p>
                <p className="text-(--color-text-muted) text-xs mt-1">{t('tore_gesamt')}</p>
              </div>
            )}
            {topAssistData.length > 0 && (
              <div className="bg-[var(--color-grau)] rounded-xl p-5 border border-(--color-border) card-hover">
                <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-1">{t('meiste_vorlagen')}</p>
                <p className="text-[var(--color-aka)] text-lg font-bold">{topAssistData[0].fullName || topAssistData[0].name} — {topAssistData[0].value}</p>
                <p className="text-(--color-text-muted) text-xs mt-1">{t('assists_gesamt')}</p>
              </div>
            )}
            {topCardsData.length > 0 && (
              <div className="bg-[var(--color-grau)] rounded-xl p-5 border border-(--color-border) card-hover">
                <p className="text-(--color-text-muted) text-xs uppercase tracking-wider mb-1">{t('meiste_karten')}</p>
                <p className="text-[var(--color-aka)] text-lg font-bold">{topCardsData[0].fullName || topCardsData[0].name} — {topCardsData[0].value}</p>
                <p className="text-(--color-text-muted) text-xs mt-1">{t('karten_gesamt')}</p>
              </div>
            )}
          </div>
        </FadeInSection>
      </div>
    </div>
  )
}
