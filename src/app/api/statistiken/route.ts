import { NextResponse } from 'next/server'
import { getTopScorers, getTopAssists, getTopCards } from '@/lib/footballApi'

export async function GET() {
  try {
    const league = process.env.WM_LEAGUE_ID || '1'
    const season = process.env.WM_SEASON || '2026'

    const [scorers, assists, cards] = await Promise.all([
      getTopScorers({ league, season }),
      getTopAssists({ league, season }),
      getTopCards({ league, season }),
    ])

    return NextResponse.json({ scorers, assists, cards })
  } catch {
    return NextResponse.json(
      { fehler: 'Interner Serverfehler' },
      { status: 500 }
    )
  }
}
