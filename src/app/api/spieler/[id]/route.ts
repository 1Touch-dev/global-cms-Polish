import { NextResponse } from 'next/server'
import { getPlayerStatistics } from '@/lib/footballApi'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const data = await getPlayerStatistics({
      player: id,
      season: process.env.WM_SEASON || '2026',
      league: process.env.WM_LEAGUE_ID || '1',
    })

    if (!data) {
      return NextResponse.json({ fehler: 'Spieler nicht gefunden' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
