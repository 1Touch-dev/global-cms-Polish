'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface TimeLeft {
  tage: number
  stunden: number
  minuten: number
  sekunden: number
}

interface CountdownTimerProps {
  targetDate?: string
}

export function CountdownTimer({ targetDate = '2026-07-19T20:00:00Z' }: CountdownTimerProps) {
  const t = useTranslations('wm')
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ tage: 0, stunden: 0, minuten: 0, sekunden: 0 })
  const [isInPast, setIsInPast] = useState(false)

  useEffect(() => {
    setMounted(true)
    const countdownTarget = new Date(targetDate)

    const calculate = () => {
      const now = new Date()
      const diff = countdownTarget.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ tage: 0, stunden: 0, minuten: 0, sekunden: 0 })
        setIsInPast(true)
        return
      }

      setIsInPast(false)
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
  }, [targetDate])

  const units = [
    { value: timeLeft.tage, label: t('tage') },
    { value: timeLeft.stunden, label: t('stunden') },
    { value: timeLeft.minuten, label: t('minuten') },
    { value: timeLeft.sekunden, label: t('sekunden') },
  ]

  if (!mounted) return null

  if (isInPast) {
    return (
      <p className="text-sm font-semibold text-[var(--accent)]">
        {t('live') ?? 'LIVE'}
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
      {units.map((unit, idx) => (
        <div key={unit.label} className="flex items-end gap-3 sm:gap-4">
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
            <span className="mb-6 text-2xl font-bold text-[var(--accent)] sm:text-4xl sm:mb-7">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
