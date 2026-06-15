import { Link } from '@/i18n/routing'
import { Clock, Flame } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  type BialoCzerwoniArticle,
  bcPrimaryCategory,
  bcThumbnail,
  formatDatePl,
  resolveBcArticle,
} from '@/lib/bialoCzerwoniApi'

export function BcFeaturedCard({
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
    <Link href={`/wiadomosc/${article.slug}`} className="group block">
      <Card className="card-hover overflow-hidden p-0">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {thumb && (
            <div className="relative min-h-[240px] overflow-hidden md:min-h-[360px]">
              <img
                src={thumb}
                alt={resolved.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
            </div>
          )}
          <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className="badge-red inline-flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5" />
                Najnowsze
              </span>
              {cat && <Badge>{cat}</Badge>}
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold leading-tight text-[var(--text-main)] transition group-hover:text-[var(--accent)] md:text-3xl">
                {resolved.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-7 text-[var(--text-muted)] md:text-base">
                {resolved.summary || resolved.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDatePl(article.createdAt, { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="font-semibold text-[var(--accent)]">{resolved.authorName}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
