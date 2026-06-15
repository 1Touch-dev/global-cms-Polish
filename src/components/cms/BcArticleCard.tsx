import { Link } from '@/i18n/routing'
import { Clock, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  type BialoCzerwoniArticle,
  bcPrimaryCategory,
  bcThumbnail,
  formatDatePl,
  resolveBcArticle,
} from '@/lib/bialoCzerwoniApi'

export function BcArticleCard({
  article,
  locale = 'pl',
}: {
  article: BialoCzerwoniArticle
  locale?: string
}) {
  const thumb = bcThumbnail(article)
  const cat = bcPrimaryCategory(article)
  const resolved = resolveBcArticle(article, locale)

  return (
    <Link href={`/wiadomosc/${article.slug}`} className="group block h-full">
      <Card className="card-hover flex h-full flex-col gap-0 overflow-hidden p-0">
        {thumb && (
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={thumb}
              alt={resolved.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            {cat && <Badge>{cat}</Badge>}
            <span className="inline-flex shrink-0 items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="h-3.5 w-3.5" />
              {formatDatePl(article.createdAt, { day: '2-digit', month: 'short' })}
            </span>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--text-main)] transition group-hover:text-[var(--accent)]">
            {resolved.title}
          </h3>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {resolved.summary || resolved.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
            Czytaj więcej <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Card>
    </Link>
  )
}
