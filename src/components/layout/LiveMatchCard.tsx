import { Link } from '@/i18n/routing'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/LiveBadge'
import type { Spiel } from '@/types/spiel.types'

export function LiveMatchCard({ spiel }: { spiel: Spiel }) {
  const score = spiel.ergebnis ? `${spiel.ergebnis.team1} : ${spiel.ergebnis.team2}` : 'vs'

  return (
    <Link href={`/spiele/${spiel.id}`} className="group block">
      <Card className="card-hover overflow-hidden p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <StatusBadge status={spiel.status || 'Live'} />
            <span className="text-xs text-[var(--text-muted)]">{spiel.gruppe || spiel.stadion}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-sm font-semibold text-[var(--text-main)]">{spiel.team1.name}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{spiel.stadion}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-2 text-lg font-bold text-[var(--accent)]">
              {score}
            </div>
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-semibold text-[var(--text-main)]">{spiel.team2.name}</p>
              <p className="truncate text-xs text-[var(--text-muted)]">{spiel.uhrzeit}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
