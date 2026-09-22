import { NextResponse } from 'next/server'
import {
  POLAND_VOLLEYBALL_PROFILE,
  isAllowedSportsQuery,
  lookupLeagueTeams,
  searchTeams,
} from '@/lib/sportsdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const country = searchParams.get('country')
  const leagueId = searchParams.get('leagueId')

  if (!isAllowedSportsQuery(POLAND_VOLLEYBALL_PROFILE, sport, country)) {
    return NextResponse.json(
      { error: 'Only Poland Volleyball is allowed on this site' },
      { status: 400 },
    )
  }

  try {
    if (leagueId) {
      const teams = await lookupLeagueTeams(leagueId)
      return NextResponse.json(teams)
    }
    const teams = await searchTeams(
      POLAND_VOLLEYBALL_PROFILE.country,
      POLAND_VOLLEYBALL_PROFILE.sport,
    )
    return NextResponse.json(teams)
  } catch (err) {
    console.error('[/api/sports/teams]', err)
    return NextResponse.json([], { status: 200 })
  }
}
