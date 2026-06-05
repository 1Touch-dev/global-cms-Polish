import { NextResponse } from 'next/server'
import { getStandings, getTopScorers, getFixtures } from '@/lib/footballApi'

const LEAGUE_MAP: Record<string, string> = {
  'bundesliga': '78',
  'champions-league': '2',
  'premier-league': '39',
  'la-liga': '140',
  'serie-a': '135',
  'ligue-1': '61',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leagueId: string }> }
) {
  const { leagueId } = await params
  const apiLeagueId = LEAGUE_MAP[leagueId]

  if (!apiLeagueId) {
    return NextResponse.json(
      { fehler: `Unbekannte Liga: ${leagueId}` },
      { status: 404 }
    )
  }

  const season = '2024'

  try {
    const [standings, scorers, fixtures] = await Promise.all([
      getStandings({ league: apiLeagueId, season }),
      getTopScorers({ league: apiLeagueId, season }),
      getFixtures({ league: apiLeagueId, season, last: '5' }),
    ])

    return NextResponse.json({ standings, scorers, fixtures })
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
