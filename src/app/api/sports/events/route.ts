import { NextResponse } from 'next/server'
import {
  POLAND_VOLLEYBALL_PROFILE,
  eventsOnDate,
  getPolandVolleyballHomeData,
  isAllowedSportsQuery,
  nextLeagueEvents,
} from '@/lib/sportsdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get('sport')
  const country = searchParams.get('country')
  const leagueId = searchParams.get('leagueId')
  const date = searchParams.get('date')

  if (!isAllowedSportsQuery(POLAND_VOLLEYBALL_PROFILE, sport, country)) {
    return NextResponse.json(
      { error: 'Only Poland Volleyball is allowed on this site' },
      { status: 400 },
    )
  }

  try {
    if (leagueId) {
      const events = await nextLeagueEvents(leagueId)
      return NextResponse.json(events)
    }
    if (date) {
      const events = await eventsOnDate(date, POLAND_VOLLEYBALL_PROFILE.sport)
      return NextResponse.json(events)
    }
    const { events } = await getPolandVolleyballHomeData()
    return NextResponse.json(events)
  } catch (err) {
    console.error('[/api/sports/events]', err)
    return NextResponse.json([], { status: 200 })
  }
}
