export interface Stadion {
  id: string
  name: string
  stadt: string
  land: 'USA' | 'Kanada' | 'Mexiko'
  kapazitaet: number
  koordinaten: { lat: number; lng: number }
  spiele: number
  bild: string
  eroeffnet: number
}

export const WM_STADIEN: Stadion[] = []
