'use client'

import dynamic from 'next/dynamic'
import { Stadion } from '@/lib/stadien-data'

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

interface StadionKarteProps {
  stadien: Stadion[]
  selectedStadion?: Stadion | null
  onSelect?: (stadion: Stadion) => void
}

export function StadionKarte({ stadien, selectedStadion, onSelect }: StadionKarteProps) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-(--color-border)">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        className="w-full h-full"
        style={{ background: '#1A1A1A' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        {stadien.map((stadion) => (
          <Marker
            key={stadion.id}
            position={[stadion.koordinaten.lat, stadion.koordinaten.lng]}
            eventHandlers={{
              click: () => onSelect?.(stadion),
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{stadion.name}</strong>
                <br />
                {stadion.stadt}, {stadion.land}
                <br />
                Kapazität: {stadion.kapazitaet.toLocaleString('de-DE')}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
