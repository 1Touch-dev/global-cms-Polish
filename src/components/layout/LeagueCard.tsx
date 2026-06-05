import { ChevronRight, TrendingUp } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Card } from '@/components/ui/Card'

export function LeagueCard({
  name,
  href,
  flag,
  top,
}: {
  name: string
  href: string
  flag: string
  top: string
}) {
  return (
    <Link href={href} className="group block">
      <Card className="card-hover flex items-center gap-4">
        <span className="text-3xl">{flag}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm text-[var(--text-main)] transition group-hover:text-[var(--accent)]">{name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <TrendingUp className="h-3 w-3 text-[var(--accent)]" />
            Lider: {top}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-[var(--accent)]" />
      </Card>
    </Link>
  )
}
