import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { BcArticleCard } from './BcArticleCard'
import { BcFeaturedCard } from './BcFeaturedCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { BcListResponse } from '@/lib/bialoCzerwoniApi'

interface BcSectionPageProps {
  title: string
  eyebrow?: string
  data: BcListResponse | null
  basePath: string
  currentPage: number
}

export function BcSectionPage({
  title,
  eyebrow,
  data,
  basePath,
  currentPage,
}: BcSectionPageProps) {
  if (!data || data.data.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <SectionHeader title={title} eyebrow={eyebrow} />
        <div className="flex min-h-[320px] items-center justify-center rounded-[20px] border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text-muted)]">
          Brak artykułów w tej kategorii.
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
      />

      <BcFeaturedCard article={featured} />

      {rest.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rest.map((article) => (
            <BcArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          {hasPrev ? (
            <Link
              href={`${basePath}?strona=${currentPage - 1}`}
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
              href={`${basePath}?strona=${currentPage + 1}`}
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
