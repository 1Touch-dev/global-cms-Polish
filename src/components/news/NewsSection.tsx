'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Newspaper, ArrowRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import {
  BC_ENDPOINTS,
  bcPrimaryCategory,
  bcThumbnail,
  filterArticlesMentioningTeams,
  fetchBialoCzerwoniArticlesByEndpoint,
  fetchBialoCzerwoniNewsPage,
  resolveBcArticle,
  type BialoCzerwoniArticle,
} from '@/lib/bialoCzerwoniApi'

export interface NewsArtikel {
  id: string
  slug: string
  titel: string
  zusammenfassung: string
  datum: string
  kategorie: string
  bild?: string
}

type NewsSource = 'wm' | 'teams' | 'players' | 'stadiums'

interface NewsSectionProps {
  title?: string
  titel?: string
  news?: NewsArtikel[]
  source?: NewsSource
  maxArticles?: number
  maxArtikel?: number
  compact?: boolean
  kompakt?: boolean
  teamNames?: string[]
}

function mapArticle(article: BialoCzerwoniArticle): NewsArtikel {
  const resolved = resolveBcArticle(article)
  return {
    id: article._id,
    slug: article.slug,
    titel: resolved.title,
    zusammenfassung: resolved.summary || resolved.description || '',
    datum: article.createdAt,
    kategorie: bcPrimaryCategory(article),
    bild: bcThumbnail(article),
  }
}

async function loadBySource(source: NewsSource, limit: number, teamNames: string[] = []) {
  switch (source) {
    case 'wm':
      return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Wc2026, { limit })
    case 'players':
      return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Players, { limit })
    case 'stadiums':
      return fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Stadiums, { limit })
    case 'teams':
      return fetchBialoCzerwoniNewsPage(1, teamNames.length > 0 ? 40 : limit)
  }
}

export function NewsSection({
  title,
  titel,
  news,
  source,
  maxArticles,
  maxArtikel,
  compact,
  kompakt,
  teamNames = [],
}: NewsSectionProps) {
  const locale = useLocale()
  const dateLocale = locale === 'en' ? 'en-US' : 'pl-PL'
  const resolvedTitle = title || titel || 'NEWS'
  const resolvedMaxArticles = maxArticles ?? maxArtikel ?? 4
  const resolvedCompact = compact ?? kompakt ?? false
  const teamNamesKey = teamNames.join('|')
  const [dynamicNews, setDynamicNews] = useState<NewsArtikel[]>(news || [])

  useEffect(() => {
    setDynamicNews(news || [])
  }, [news])

  useEffect(() => {
    if (news || !source) return

    let active = true
    loadBySource(source, resolvedMaxArticles, teamNames).then((data) => {
      if (!active) return
      const articles = teamNames.length > 0
        ? filterArticlesMentioningTeams(data?.data || [], teamNames)
        : data?.data || []
      setDynamicNews(articles.map(mapArticle))
    })

    return () => {
      active = false
    }
  }, [news, source, resolvedMaxArticles, teamNamesKey])

  const articles = useMemo(
    () => dynamicNews.slice(0, resolvedMaxArticles),
    [dynamicNews, resolvedMaxArticles],
  )

  if (resolvedCompact) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h3 className="inline-flex items-center gap-2 text-sm text-[var(--text-main)]">
            <Newspaper className="h-4 w-4 text-[var(--accent)]" />
            {resolvedTitle}
          </h3>
          <Link href="/news" className="text-xs font-semibold text-[var(--accent)]">
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {articles.length > 0 ? articles.map((article) => (
            <Link key={article.id} href={`/wiadomosc/${article.slug}`} className="block px-4 py-3 transition hover:bg-[var(--surface-soft)]">
              <div className="space-y-1">
                <p className="line-clamp-1 text-sm text-[var(--text-main)]">{article.titel}</p>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <span className="text-[var(--accent)]">{article.kategorie}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(article.datum).toLocaleDateString(dateLocale, { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              </div>
            </Link>
          )) : (
            <div className="px-4 py-3 text-xs text-[var(--text-muted)]">Brak artykułów.</div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <section>
      <SectionHeader
        title={resolvedTitle}
        eyebrow="NEWSROOM"
        actions={
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Wszystkie newsy <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {articles.length > 0 ? articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/wiadomosc/${article.slug}`}
            className={index === 0 ? 'md:col-span-2' : ''}
          >
            <Card className="h-full overflow-hidden p-0 transition hover:border-[var(--accent)]">
              <div className={`p-5 ${index === 0 ? 'md:flex md:items-center md:gap-6' : ''}`}>
                {index === 0 && article.bild && (
                  <img src={article.bild} alt={article.titel} className="mb-4 h-48 w-full rounded-xl object-cover md:mb-0 md:w-72" />
                )}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-[var(--surface-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--accent)]">
                      {article.kategorie}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <Clock className="h-3 w-3" />
                      {new Date(article.datum).toLocaleDateString(dateLocale, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className={`text-[var(--text-main)] ${index === 0 ? 'text-lg md:text-xl' : 'text-sm'}`}>
                    {article.titel}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--text-muted)]">{article.zusammenfassung}</p>
                </div>
              </div>
            </Card>
          </Link>
        )) : (
          <div className="text-sm text-[var(--text-muted)]">Brak artykułów.</div>
        )}
      </div>
    </section>
  )
}

export type { NewsArtikel as CmsNewsArtikel }
