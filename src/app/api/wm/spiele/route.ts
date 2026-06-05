import { NextResponse } from 'next/server'
import { getFixtures } from '@/lib/footballApi'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const team = searchParams.get('team') || undefined
    const next = searchParams.get('next') || undefined
    const last = searchParams.get('last') || undefined

    const data = await getFixtures({
      league: process.env.WM_LEAGUE_ID || '1',
      season: process.env.WM_SEASON || '2026',
      team,
      next,
      last,
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
