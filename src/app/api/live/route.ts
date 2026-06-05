import { NextResponse } from 'next/server'
import { getLiveMatches } from '@/lib/footballApi'

export async function GET() {
  try {
    const data = await getLiveMatches()

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
