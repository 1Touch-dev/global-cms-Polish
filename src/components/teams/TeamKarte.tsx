'use client'

import { Team } from '@/types/team.types'
import { Link } from '@/i18n/routing'
import { ArrowUpRight } from 'lucide-react'

interface TeamKarteProps {
  team: Team
}

export function TeamKarte({ team }: TeamKarteProps) {
  const rankingColor = team.fifaRanking <= 10
    ? 'text-[var(--color-aka)]'
    : team.fifaRanking <= 25
    ? 'text-green-400'
    : 'text-(--color-text-muted)'

  return (
    <Link href={`/teams/${team.id}`}>
      <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) hover:border-[var(--color-aka)]/40 transition-all group cursor-pointer relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-aka)]/3 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {team.wappen ? (
              <img src={team.wappen} alt={team.name} className="w-9 h-9 object-contain" />
            ) : (
              <span className="text-3xl">{team.flagge}</span>
            )}
            <div>
              <h3 className="text-(--color-text-primary) font-semibold group-hover:text-[var(--color-aka)] transition-colors">{team.name}</h3>
              <p className="text-(--color-text-muted) text-xs">{team.kurzname}</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-(--color-text-secondary) group-hover:text-[var(--color-aka)] transition-colors" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${rankingColor}`}>
              #{team.fifaRanking}
            </span>
            <span className="text-xs text-(--color-text-secondary)">FIFA</span>
          </div>
          {team.gruppe && (
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[var(--color-aka)]/10 text-[var(--color-aka)] border border-[var(--color-aka)]/20 rounded">
              Gr. {team.gruppe}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
