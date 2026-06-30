import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BcArticleCard } from './BcArticleCard'
import { BcFeaturedCard } from './BcFeaturedCard'
import { BcNewsSearchBar } from './BcNewsSearchBar'
import { SectionHeader } from '@/components/ui/SectionHeader'
import AffiliateBannerFrame from '@/components/affiliates/AffiliateBannerFrame'
import type { BcListResponse } from '@/lib/bialoCzerwoniApi'

export interface BcSectionFilter {
  label: string
  value: string
}

interface BcSectionPageProps {
  title: string
  eyebrow?: string
  data: BcListResponse | null
  basePath: string
  currentPage: number
  searchQuery?: string
  selectedFilter?: string
  filters?: BcSectionFilter[]
  showSearch?: boolean
  locale?: string
}

export function BcSectionPage({
  title,
  eyebrow,
  data,
  basePath,
  currentPage,
  searchQuery = '',
  selectedFilter = '',
  filters = [],
  showSearch = false,
  locale = 'pl',
}: BcSectionPageProps) {
  const buildHref = (page?: number, filter = selectedFilter) => {
    const params = new URLSearchParams()
    if (page && page > 1) params.set('strona', String(page))
    if (searchQuery) params.set('szukaj', searchQuery)
    if (filter) params.set('sekcja', filter)
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 lg:px-6">
        <SectionHeader
          title={title}
          eyebrow={eyebrow}
          actions={showSearch ? (
            <Suspense fallback={null}>
              <BcNewsSearchBar initialValue={searchQuery} />
            </Suspense>
          ) : undefined}
        />
        {filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <Link
                key={filter.value || 'all'}
                href={buildHref(undefined, filter.value)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  selectedFilter === filter.value
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
                }`}
              >
                {filter.label}
              </Link>
            ))}
          </div>
        )}
        <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)]">
          {searchQuery ? 'Brak artykułów pasujących do wyszukiwania.' : 'Brak artykułów w tej kategorii.'}
        </div>
      </div>
    )
  }

  const [featured, ...rest] = data.data
  const { totalPages } = data.meta
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6 space-y-8">
      <SectionHeader
        title={title}
        eyebrow={eyebrow ?? `${data.meta.total} artykułów`}
        actions={showSearch ? (
          <Suspense fallback={null}>
            <BcNewsSearchBar initialValue={searchQuery} />
          </Suspense>
        ) : undefined}
      />

      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => (
            <Link
              key={filter.value || 'all'}
              href={buildHref(undefined, filter.value)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                selectedFilter === filter.value
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text-main)]'
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      )}

      <BcFeaturedCard article={featured} locale={locale} />

      {rest.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[1fr_120px]">
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((article) => (
              <BcArticleCard key={article._id} article={article} locale={locale} />
            ))}
          </div>
          <div className="hidden xl:block">
            <AffiliateBannerFrame locale={locale ?? 'pl'} variant="verticalSecondary" />
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {hasPrev ? (
            <Link
              href={buildHref(currentPage - 1)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
            >
              <ChevronLeft className="h-4 w-4" /> Poprzednia
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] opacity-40 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" /> Poprzednia
            </span>
          )}

          <span className="text-sm text-[var(--text-muted)]">
            {currentPage} / {totalPages}
          </span>

          {hasNext ? (
            <Link
              href={buildHref(currentPage + 1)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
            >
              Następna <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-muted)] opacity-40 cursor-not-allowed">
              Następna <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
