'use client'

import { Team } from '@/types/team.types'
import { TeamKarte } from './TeamKarte'

interface TeamGridProps {
  teams: Team[]
}

export function TeamGrid({ teams }: TeamGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map((team) => (
        <TeamKarte key={team.id} team={team} />
      ))}
    </div>
  )
}
