import { Clock, Flame } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { NewsArtikel } from './ArticleCard'

export function FeaturedArticleCard({
  artikel,
  locale = 'pl-PL',
}: {
  artikel: NewsArtikel
  locale?: string
}) {
  return (
    <Link href="/news" className="group block">
      <Card className="card-hover overflow-hidden p-0">
        <div className="relative flex min-h-[320px] flex-col justify-between gap-8 p-6 md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(22,163,74,0.12),transparent_42%,rgba(250,204,21,0.08))]" />
          <div className="relative flex items-center gap-2">
            <span className="badge-red">
              <Flame className="h-3.5 w-3.5" />
              Breaking
            </span>
            <Badge>{artikel.kategorie}</Badge>
          </div>
          <div className="relative max-w-3xl space-y-4">
            <h3 className="text-3xl leading-tight text-[var(--text-main)] transition group-hover:text-[var(--accent)] md:text-4xl">
              {artikel.titel}
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)] md:text-base">
              {artikel.zusammenfassung}
            </p>
          </div>
          <div className="relative flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {new Date(artikel.datum).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
            <span className="font-semibold text-[var(--accent)]">Matchday Arena</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
