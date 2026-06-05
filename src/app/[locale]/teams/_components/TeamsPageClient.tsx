'use client'

import { useTranslations } from 'next-intl'
import { TeamGrid } from '@/components/teams/TeamGrid'
import { Team } from '@/types/team.types'
import { useState } from 'react'
import { Users, Filter } from 'lucide-react'

interface TeamsPageProps {
  teams: Team[]
  gruppen: { name: string; teams: { id: number; name: string }[] }[]
}

export default function TeamsPageClient({ teams, gruppen }: TeamsPageProps) {
  const t = useTranslations('teams')
  const [filterGruppe, setFilterGruppe] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'ranking'>('name')

  const gruppenNames = gruppen.map(g => g.name)

  let filteredTeams = filterGruppe ? teams.filter(team => team.gruppe === filterGruppe) : teams

  if (sortBy === 'name') {
    filteredTeams = [...filteredTeams].sort((a, b) => a.name.localeCompare(b.name))
  } else {
    filteredTeams = [...filteredTeams].sort((a, b) => a.fifaRanking - b.fifaRanking)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-8 h-8 text-[var(--color-aka)]" />
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide">
          {t('alle_teilnehmer')}
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 mt-4">
        <Filter className="w-4 h-4 text-(--color-text-muted)" />
        <select
          value={filterGruppe || ''}
          onChange={(e) => setFilterGruppe(e.target.value || null)}
          className="bg-[var(--color-grau)] border border-(--color-border) text-(--color-text-secondary) text-sm rounded-lg px-3 py-1.5"
        >
          <option value="">{t('alle_gruppen')}</option>
          {gruppenNames.map(g => (
            <option key={g} value={g}>{t('gruppe', { name: g })}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'ranking')}
          className="bg-[var(--color-grau)] border border-(--color-border) text-(--color-text-secondary) text-sm rounded-lg px-3 py-1.5"
        >
          <option value="name">{t('alphabetisch')}</option>
          <option value="ranking">{t('fifa_ranking')}</option>
        </select>
      </div>

      {filteredTeams.length > 0 ? (
        <TeamGrid teams={filteredTeams} />
      ) : (
        <div className="bg-[var(--color-grau)] rounded-xl p-12 border border-(--color-border) text-center">
          <Users className="w-10 h-10 text-(--color-text-secondary) mx-auto mb-3" />
          <p className="text-(--color-text-muted)">{t('keine_mannschaften')}</p>
        </div>
      )}
    </div>
  )
}
