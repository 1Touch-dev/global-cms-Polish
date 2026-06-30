import { NextResponse } from 'next/server'
import { getVenues } from '@/lib/footballApi'

type ApiVenue = {
  id?: number
  name?: string
  city?: string
  country?: string
  capacity?: number
  image?: string
}

function normalizeVenues(raw: unknown): ApiVenue[] {
  if (Array.isArray(raw)) return raw as ApiVenue[]
  const obj = raw as Record<string, unknown>
  return Array.isArray(obj?.response) ? (obj.response as ApiVenue[]) : []
}

async function fetchCountry(country: string) {
  const raw = await getVenues({ country })
  return normalizeVenues(raw)
    .filter((v) => v.id && v.name)
    .map((v) => ({
      id: String(v.id),
      name: v.name || '',
      stadt: v.city || '',
      land: v.country || country,
      kapazitaet: v.capacity || 0,
      bild: v.image || '',
    }))
}

export async function GET() {
  try {
    const venues = (
      await Promise.all([fetchCountry('USA'), fetchCountry('Mexico'), fetchCountry('Canada')])
    ).flat()
    return NextResponse.json(venues)
  } catch {
    return NextResponse.json([])
  }
}
