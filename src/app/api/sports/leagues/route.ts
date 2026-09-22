import { NextResponse } from 'next/server'
import {
  POLAND_VOLLEYBALL_PROFILE,
  isAllowedSportsQuery,
  resolveLeagues,
} from '@/lib/sportsdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const country = searchParams.get('country')

  if (!isAllowedSportsQuery(POLAND_VOLLEYBALL_PROFILE, sport, country)) {
    return NextResponse.json(
      { error: 'Only Poland Volleyball is allowed on this site' },
      { status: 400 },
    )
  }

  try {
    const leagues = await resolveLeagues(POLAND_VOLLEYBALL_PROFILE)
    return NextResponse.json(leagues)
  } catch (err) {
    console.error('[/api/sports/leagues]', err)
    return NextResponse.json([], { status: 200 })
  }
}
