'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Filter, Newspaper, Flame } from 'lucide-react'
import { useMemo, useState } from 'react'
import { getNewsCollections } from '@/components/news/NewsSection'
import { FeaturedArticleCard } from '@/components/news/FeaturedArticleCard'
import { ArticleCard, type NewsArtikel } from '@/components/news/ArticleCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'

const CATEGORY_MAP: Record<'pl' | 'en', string[]> = {
  pl: ['Wszystkie', 'MŚ 2026', 'Transfer', 'Bundesliga', 'Champions League', 'Premier League', 'Zawodnicy', 'Stadiony', 'Strzelcy'],
  en: ['All', 'WC 2026', 'Transfer', 'Bundesliga', 'Champions League', 'Premier League', 'Players', 'Stadiums', 'Scorers'],
}

export default function NewsPage() {
  const t = useTranslations('news')
  const locale = useLocale() as 'pl' | 'en'
  const [filterCategory, setFilterCategory] = useState(CATEGORY_MAP[locale][0])
  const collections = getNewsCollections(locale)
  const allNews = useMemo<NewsArtikel[]>(
    () => [
      ...collections.wm,
      ...collections.teams,
      ...collections.players,
      ...collections.leagues,
      ...collections.stadiums,
      ...collections.scorers,
    ].sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()),
    [collections],
  )

  const filtered = filterCategory === CATEGORY_MAP[locale][0]
    ? allNews
    : allNews.filter((news) => news.kategorie === filterCategory)

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const dateLocale = locale === 'en' ? 'en-US' : 'pl-PL'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="space-y-6">
        <SectionHeader
          title={t('titel')}
          eyebrow="NEWSROOM"
          actions={
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text-muted)]">
              <Newspaper className="h-4 w-4 text-[var(--accent)]" />
              {t('untertitel')}
            </span>
          }
        />

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          {CATEGORY_MAP[locale].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilterCategory(category)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm transition ${
                filterCategory === category
                  ? 'border-[var(--accent)]/30 bg-[var(--surface-soft)] text-[var(--accent)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {featured && (
          <FeaturedArticleCard artikel={featured} locale={dateLocale} />
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article.id} artikel={article} locale={dateLocale} />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="text-center">
            <p className="text-3xl text-[var(--accent)]">{allNews.length}</p>
            <p className="text-sm text-[var(--text-muted)]">{t('artikel_gesamt')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl text-[var(--text-main)]">{CATEGORY_MAP[locale].length - 1}</p>
            <p className="text-sm text-[var(--text-muted)]">{t('kategorien')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl text-[var(--accent)]">5</p>
            <p className="text-sm text-[var(--text-muted)]">{t('heute')}</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl text-[var(--gold)]">24/7</p>
            <p className="text-sm text-[var(--text-muted)]">{t('live_updates')}</p>
          </Card>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-muted)]">
          <Flame className="h-4 w-4 text-[var(--danger)]" />
          {locale === 'en'
            ? 'Breaking coverage, transfer watch, stadium stories and player spotlights.'
            : 'Relacje na żywo, transfery, stadiony i profile zawodników.'}
        </div>
      </div>
    </div>
  )
}
