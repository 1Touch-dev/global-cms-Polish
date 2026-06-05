'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface TimeLeft {
  tage: number
  stunden: number
  minuten: number
  sekunden: number
}

export function CountdownTimer() {
  const t = useTranslations('wm')
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ tage: 0, stunden: 0, minuten: 0, sekunden: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const targetDate = new Date('2026-06-11T19:00:00Z')

    const calculate = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ tage: 0, stunden: 0, minuten: 0, sekunden: 0 })
        return
      }

      setTimeLeft({
        tage: Math.floor(diff / (1000 * 60 * 60 * 24)),
        stunden: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minuten: Math.floor((diff / (1000 * 60)) % 60),
        sekunden: Math.floor((diff / 1000) % 60),
      })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const units = [
    { value: timeLeft.tage, label: t('tage') },
    { value: timeLeft.stunden, label: t('stunden') },
    { value: timeLeft.minuten, label: t('minuten') },
    { value: timeLeft.sekunden, label: t('sekunden') },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-center gap-3 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="min-w-[60px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-center shadow-[var(--shadow-soft)] sm:min-w-[80px] sm:px-5 sm:py-3">
              <span className="font-[var(--font-display)] text-3xl tabular-nums text-[var(--accent)] sm:text-5xl">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-1.5 text-xs uppercase tracking-wider text-[var(--text-muted)] sm:text-sm">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className="-mt-5 text-2xl font-bold text-[var(--accent)] sm:text-4xl">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
