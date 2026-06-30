import { getTeamsPageData, getWMGruppenData, getWMSpielplanData } from '@/lib/serverData'
import { MOCK_GRUPPEN } from '@/lib/mock-data'
import type { Gruppe } from '@/types/wm.types'
import type { Spiel } from '@/types/spiel.types'
import type { Team } from '@/types/team.types'
import WM2026PageClient from './_components/WM2026PageClient'

export const dynamic = 'force-dynamic'

export default async function WM2026Page() {
  let apiGruppen: Gruppe[] = []
  let spiele: Spiel[] = []
  let teamsData: { teams: Team[] } = { teams: [] }

  try {
    ;[apiGruppen, spiele, teamsData] = await Promise.all([
      getWMGruppenData(),
      getWMSpielplanData(),
      getTeamsPageData(),
    ])
  } catch {
    // Use defaults when upstream APIs fail during build or runtime.
  }

  const gruppen = apiGruppen.length > 0 ? apiGruppen : MOCK_GRUPPEN
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
