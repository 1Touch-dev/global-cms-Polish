'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { RadioTower } from 'lucide-react'
import type { Spiel } from '@/types/spiel.types'

export function LiveScoreTicker() {
  const [liveSpiele, setLiveSpiele] = useState<Spiel[]>([])
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await fetch('/api/live', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        const spiele: Spiel[] = (data?.response || []).map((f: any) => ({
          id: f.fixture?.id,
          datum: f.fixture?.date?.split('T')[0] || '',
          uhrzeit: f.fixture?.date ? new Date(f.fixture.date).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }) : '',
          team1: {
            id: f.teams?.home?.id,
            name: f.teams?.home?.name || '',
            kurzname: f.teams?.home?.name?.slice(0, 3).toUpperCase() || '',
            flagge: '',
            wappen: f.teams?.home?.logo,
          },
          team2: {
            id: f.teams?.away?.id,
            name: f.teams?.away?.name || '',
            kurzname: f.teams?.away?.name?.slice(0, 3).toUpperCase() || '',
            flagge: '',
            wappen: f.teams?.away?.logo,
          },
          ergebnis: f.goals?.home !== null ? { team1: f.goals?.home ?? 0, team2: f.goals?.away ?? 0 } : undefined,
          status: 'Live',
          stadion: f.fixture?.venue?.name || '',
          stadt: f.fixture?.venue?.city || '',
          gruppe: f.league?.round || '',
        }))
        setLiveSpiele(spiele)
      } catch {
        // ignore network noise
      }
    }

    fetchLive()
    const interval = window.setInterval(fetchLive, 60000)
    return () => window.clearInterval(interval)
  }, [])

  if (!visible || liveSpiele.length === 0) return null

  return (
    <div className="border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-2 lg:px-6">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-3 py-1 text-[10px] font-bold uppercase text-[var(--danger)]"
            onClick={() => setVisible(false)}
          >
            <RadioTower className="h-3.5 w-3.5" />
            LIVE
          </button>
          <div className="flex items-center gap-3">
            {liveSpiele.map((spiel) => (
              <Link key={spiel.id} href={`/spiele/${spiel.id}`} className="group shrink-0">
                <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs text-[var(--text-main)] transition hover:border-[var(--accent)] hover:bg-[var(--surface-soft)]">
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent)]">
                    {spiel.team1.kurzname}
                  </span>
                  <span className="rounded-full bg-[var(--danger)] px-2 py-1 text-[10px] font-bold text-white">
                    {spiel.ergebnis ? `${spiel.ergebnis.team1}:${spiel.ergebnis.team2}` : 'vs'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[var(--accent)]">
                    {spiel.team2.kurzname}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
