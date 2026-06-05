import { Clock, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

export type NewsArtikel = {
  id: number
  titel: string
  zusammenfassung: string
  datum: string
  kategorie: string
  bild?: string
}

export function ArticleCard({
  artikel,
  locale = 'pl-PL',
}: {
  artikel: NewsArtikel
  locale?: string
}) {
  return (
    <Link href="/news" className="group block">
      <Card className="card-hover h-full overflow-hidden">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <Badge>{artikel.kategorie}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              {new Date(artikel.datum).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg text-[var(--text-main)] transition group-hover:text-[var(--accent)]">
              {artikel.titel}
            </h3>
            <p className="text-sm leading-6 text-[var(--text-muted)] line-clamp-3">
              {artikel.zusammenfassung}
            </p>
          </div>
          <div className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
            Czytaj więcej <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
