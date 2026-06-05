'use client'

import { useState, useEffect } from 'react'

interface LiveScoreProps {
  team1Tore: number
  team2Tore: number
  team1Name: string
  team2Name: string
  minute?: number
  onScoreUpdate?: () => Promise<{ team1: number; team2: number; minute: number } | null>
  refreshInterval?: number
}

export function LiveScore({
  team1Tore,
  team2Tore,
  team1Name,
  team2Name,
  minute,
  onScoreUpdate,
  refreshInterval = 30000,
}: LiveScoreProps) {
  const [score, setScore] = useState({ team1: team1Tore, team2: team2Tore })
  const [currentMinute, setCurrentMinute] = useState(minute ?? 0)

  useEffect(() => {
    if (!onScoreUpdate) return

    const interval = setInterval(async () => {
      const updated = await onScoreUpdate()
      if (updated) {
        setScore({ team1: updated.team1, team2: updated.team2 })
        setCurrentMinute(updated.minute)
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [onScoreUpdate, refreshInterval])

  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-rose-500">LIVE</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{team1Name}</span>
        <span className="px-1 font-[var(--font-display)] text-xl text-[var(--text-main)]">{score.team1}</span>
        <span className="text-[var(--text-muted)]">-</span>
        <span className="px-1 font-[var(--font-display)] text-xl text-[var(--text-main)]">{score.team2}</span>
        <span className="text-sm font-medium text-[var(--text-secondary)]">{team2Name}</span>
      </div>

      {currentMinute > 0 && (
        <span className="text-xs font-medium text-[var(--accent)]">{currentMinute}&apos;</span>
      )}
    </div>
  )
}
