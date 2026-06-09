import Image from 'next/image'
import Link from 'next/link'
import { Clock, Flame } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { type BialoCzerwoniArticle, bcThumbnail, formatDatePl } from '@/lib/bialoCzerwoniApi'

export function BcFeaturedCard({ article }: { article: BialoCzerwoniArticle }) {
  const thumb = bcThumbnail(article)
  const cat = article.category?.[0]

  return (
    <Link href={`/wiadomosc/${article.slug}`} className="group block">
      <Card className="card-hover overflow-hidden p-0">
        <div className="grid md:grid-cols-[1.2fr_1fr]">
          {thumb && (
            <div className="relative min-h-[240px] overflow-hidden md:min-h-[360px]">
              <Image
                src={thumb}
                alt={article.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 55vw"
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
                {article.title}
              </h2>
              <p className="line-clamp-3 text-sm leading-7 text-[var(--text-muted)] md:text-base">
                {article.summary || article.description}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDatePl(article.createdAt, { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              <span className="font-semibold text-[var(--accent)]">Biało-Czerwoni</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
