import { getVenues } from '@/lib/footballApi'
import StadienPageClient from './_components/StadienPageClient'
import { Stadion } from '@/lib/stadien-data'

type ApiVenue = {
  id?: number
  name?: string
  city?: string
  country?: string
  capacity?: number
  coordinates?: { lat?: number; lng?: number }
  image?: string
  surface?: string
}

function normalizeVenues(raw: unknown): ApiVenue[] {
  if (Array.isArray(raw)) return raw as ApiVenue[]
  const obj = raw as Record<string, unknown>
  return Array.isArray(obj?.response) ? (obj.response as ApiVenue[]) : []
}

async function fetchCountry(country: string, landLabel: 'USA' | 'Mexiko' | 'Kanada'): Promise<Stadion[]> {
  const raw = await getVenues({ country })
  return normalizeVenues(raw)
    .filter((v) => v.id && v.name && (v.capacity ?? 0) > 30000)
    .map((v) => ({
      id: String(v.id),
      name: v.name || '',
      stadt: v.city || '',
      land: landLabel,
      kapazitaet: v.capacity || 0,
      koordinaten: v.coordinates?.lat && v.coordinates?.lng
        ? { lat: v.coordinates.lat, lng: v.coordinates.lng }
        : { lat: 0, lng: 0 },
      spiele: 0,
      bild: v.image || '',
      eroeffnet: 0,
    }))
}

export default async function StadienPage() {
  let stadien: Stadion[] = []

  try {
    stadien = (
      await Promise.all([
        fetchCountry('USA', 'USA'),
        fetchCountry('Mexico', 'Mexiko'),
        fetchCountry('Canada', 'Kanada'),
      ])
    ).flat()
  } catch {
    // API unavailable — render with empty list
  }

  return <StadienPageClient stadien={stadien} />
}
