'use client'

import { Stadion } from '@/lib/stadien-data'
import { MapPin, Users, Calendar } from 'lucide-react'

interface StadionInfoProps {
  stadion: Stadion
}

export function StadionInfo({ stadion }: StadionInfoProps) {
  const landFlag: Record<string, string> = {
    USA: '🇺🇸',
    Kanada: '🇨🇦',
    Mexiko: '🇲🇽',
  }

  return (
    <div className="bg-[var(--color-grau)] rounded-xl p-4 border border-(--color-border) card-hover">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-(--color-text-primary) font-semibold text-sm">{stadion.name}</h3>
        <span className="text-lg">{landFlag[stadion.land]}</span>
      </div>
      <div className="space-y-2 text-xs text-(--color-text-muted)">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-aka)]" />
          <span>{stadion.stadt}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[var(--color-aka)]" />
          <span>{stadion.kapazitaet.toLocaleString('de-DE')} Plätze</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-[var(--color-aka)]" />
          <span>Eröffnet {stadion.eroeffnet}</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-(--color-border)">
        <span className="text-[var(--color-aka)] text-xs font-medium">
          {stadion.spiele} WM-Spiele
        </span>
      </div>
    </div>
  )
}
