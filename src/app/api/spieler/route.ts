import { NextResponse } from 'next/server'
import { searchPlayers } from '@/lib/footballApi'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    if (!search) {
      return NextResponse.json({ fehler: 'Suchbegriff erforderlich' }, { status: 400 })
    }

    const data = await searchPlayers(search)

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
