import { NextResponse } from 'next/server'

/**
 * IndexNow webhook — DEPRECATED
 *
 * IndexNow pings are fired directly by the global_cms backend on article save.
 * This frontend route is no longer needed. Kept as a 410 stub so any old CMS
 * webhook config fails loudly rather than silently timing out.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Deprecated — IndexNow pings are handled by CMS. Remove this webhook from CMS config.' },
    { status: 410 },
  )
}

export async function GET() {
  return NextResponse.json({ status: 'deprecated', note: 'IndexNow pings handled by CMS backend.' })
}
