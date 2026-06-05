'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Stadion } from '@/lib/stadien-data'

const goldIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:24px;height:24px;background:#FFCC00;border:2px solid #000;border-radius:50%;box-shadow:0 2px 6px rgba(255,204,0,0.4);display:flex;align-items:center;justify-content:center;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
})

interface StadionMapClientProps {
  stadien: Stadion[]
  onSelect?: (stadion: Stadion) => void
}

export default function StadionMapClient({ stadien, onSelect }: StadionMapClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        />
        {stadien.map((stadion) => (
          <Marker
            key={stadion.id}
            position={[stadion.koordinaten.lat, stadion.koordinaten.lng]}
            icon={goldIcon}
            eventHandlers={{
              click: () => onSelect?.(stadion),
            }}
          >
            <Popup>
              <div className="text-xs font-sans">
                <strong className="text-sm">{stadion.name}</strong>
                <br />
                📍 {stadion.stadt}, {stadion.land}
                <br />
                👥 {stadion.kapazitaet.toLocaleString('de-DE')} Plätze
                <br />
                ⚽ {stadion.spiele} WM-Spiele
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
