'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAffiliateCopy, getAffiliateOffers } from './AffiliateConfig'

interface AffiliateMatchWidgetProps {
  locale: string
  homeTeam?: string
  awayTeam?: string
  className?: string
}

const ROTATE_MS = 9000

export default function AffiliateMatchWidget({
  locale,
  homeTeam,
  awayTeam,
  className = '',
}: AffiliateMatchWidgetProps) {
  const sharedCopy = getAffiliateCopy(locale)
  const offers = useMemo(() => getAffiliateOffers(locale), [locale])
  const matchup = homeTeam && awayTeam ? `${homeTeam} vs ${awayTeam}` : null
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % offers.length)
  }, [offers.length])

  useEffect(() => {
    if (offers.length <= 1 || paused) return
    const timer = window.setInterval(goNext, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [goNext, paused, offers.length])

  return (
    <aside
      className={`border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="bg-[var(--accent)] px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          {sharedCopy.label}
        </span>
        {matchup ? <span className="text-xs text-[var(--text-muted)]">{matchup}</span> : null}
      </div>

      <div className="relative min-h-[170px]">
        {offers.map((offer, offerIndex) => {
          const { copy } = offer
          return (
            <div
              key={offer.provider}
              className="transition-opacity duration-500 ease-in-out"
              style={{
                opacity: offerIndex === index ? 1 : 0,
                position: offerIndex === index ? 'relative' : 'absolute',
                inset: offerIndex === index ? undefined : 0,
                pointerEvents: offerIndex === index ? 'auto' : 'none',
              }}
              aria-hidden={offerIndex !== index}
            >
              <div className={`mb-2 text-xs font-bold uppercase tracking-widest ${offer.badgeClass}`}>{offer.provider}</div>
              <h2 className="text-lg font-black text-[var(--text-main)]">{copy.matchTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{copy.matchDescription}</p>
              <Link
                href={offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`mt-4 inline-flex w-full items-center justify-center border px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-90 ${offer.accentClass}`}
              >
                {copy.cta} ↗
              </Link>
            </div>
          )
        })}
      </div>

      {offers.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {offers.map((offer, offerIndex) => (
            <button
              key={offer.provider}
              type="button"
              onClick={() => setIndex(offerIndex)}
              className={`h-1.5 rounded-full transition-all ${
                offerIndex === index ? 'w-5 bg-[var(--accent)]' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Show ${offer.provider} match offer`}
              aria-current={offerIndex === index}
            />
          ))}
        </div>
      ) : null}

      <p className="mt-3 text-[10px] leading-relaxed text-[var(--text-muted)]">{sharedCopy.terms}</p>
    </aside>
  )
}
