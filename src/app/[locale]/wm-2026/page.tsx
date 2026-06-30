import { getTeamsPageData, getWMGruppenData, getWMSpielplanData } from '@/lib/serverData'
import type { Gruppe } from '@/types/wm.types'
import type { Spiel } from '@/types/spiel.types'
import type { Team } from '@/types/team.types'
import WM2026PageClient from './_components/WM2026PageClient'

export const dynamic = 'force-dynamic'

export default async function WM2026Page() {
  let gruppen: Gruppe[] = []
  let spiele: Spiel[] = []
  let teamsData: { teams: Team[] } = { teams: [] }

  try {
    ;[gruppen, spiele, teamsData] = await Promise.all([
      getWMGruppenData(),
      getWMSpielplanData(),
      getTeamsPageData(),
    ])
  } catch {
    // API unavailable — render with empty state
  }

  const stats = {
    teams: teamsData.teams.length || gruppen.reduce((sum, gruppe) => sum + gruppe.teams.length, 0),
    fixtures: spiele.length,
    live: spiele.filter((spiel) => spiel.status === 'Live' || spiel.status === 'Halbzeit').length,
    upcoming: spiele.filter((spiel) => spiel.status === 'Geplant').length,
    completed: spiele.filter((spiel) => spiel.status === 'Beendet').length,
    groups: gruppen.length,
  }

  return <WM2026PageClient gruppen={gruppen} stats={stats} />
}
