import { NextResponse } from 'next/server'
import { getFixtures } from '@/lib/footballApi'

export async function GET() {
  try {
    const data = await getFixtures({
      league: process.env.WM_LEAGUE_ID || '1',
      season: process.env.WM_SEASON || '2026',
      last: '50',
    })

    if (!data) {
      return NextResponse.json({ fehler: 'Daten konnten nicht geladen werden' }, { status: 502 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
