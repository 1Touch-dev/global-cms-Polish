import { NextResponse } from 'next/server'
import { getTeams, getFixtures, getPlayerSquads } from '@/lib/footballApi'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const season = process.env.WM_SEASON || '2026'
    const league = process.env.WM_LEAGUE_ID || '1'

    const [teamData, fixturesData, squadData] = await Promise.all([
      getTeams({ team: id, season }),
      getFixtures({ team: id, season, league }),
      getPlayerSquads(id),
    ])

    if (!teamData) {
      return NextResponse.json({ fehler: 'Team nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ team: teamData, fixtures: fixturesData, squad: squadData })
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
