import { NextResponse } from 'next/server'
import { getMatchDetails, getMatchEvents, getFixtureStats, getLineups } from '@/lib/footballApi'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const [match, events, stats, lineups] = await Promise.all([
      getMatchDetails(id),
      getMatchEvents(id),
      getFixtureStats(id),
      getLineups(id),
    ])

    if (!match) {
      return NextResponse.json({ fehler: 'Spiel nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json({ match, events, stats, lineups })
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
