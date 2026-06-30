'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAffiliateCopy, getAffiliateOffers } from './AffiliateConfig'

interface AffiliateOfferCardProps {
  locale: string
  compact?: boolean
  className?: string
}

const ROTATE_MS = 9000

export default function AffiliateOfferCard({ locale, compact = false, className = '' }: AffiliateOfferCardProps) {
  const sharedCopy = getAffiliateCopy(locale)
  const offers = useMemo(() => getAffiliateOffers(locale), [locale])
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
    <section
      className={`relative overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-[var(--accent)]/10 p-6 ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="bg-[var(--accent)] px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
          {sharedCopy.label}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">{index + 1} / {offers.length}</span>
      </div>

      <div className="relative min-h-[220px]">
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
              <div className="mb-3">
                <span className={`text-xs font-bold uppercase tracking-widest ${offer.badgeClass}`}>{offer.provider}</span>
              </div>
              <h2 className="text-2xl font-black text-[var(--text-main)]">{compact ? copy.shortTitle : copy.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">{copy.description}</p>
              {!compact && (
                <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-[var(--text-muted)] sm:grid-cols-3">
                  <span className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2">{copy.featureLive}</span>
                  <span className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2">{copy.featureWorldCup}</span>
                  <span className="border border-[var(--border)] bg-[var(--bg)] px-3 py-2">{copy.featureMobile}</span>
                </div>
              )}
              <Link
                href={offer.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`mt-6 inline-flex w-full items-center justify-center border px-5 py-3 text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90 sm:w-auto ${offer.accentClass}`}
              >
                {copy.cta} ↗
              </Link>
            </div>
          )
        })}
      </div>

      {offers.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {offers.map((offer, offerIndex) => (
            <button
              key={offer.provider}
              type="button"
              onClick={() => setIndex(offerIndex)}
              className={`h-1.5 rounded-full transition-all ${
                offerIndex === index ? 'w-5 bg-[var(--accent)]' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Show ${offer.provider} offer`}
              aria-current={offerIndex === index}
            />
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-[10px] leading-relaxed text-[var(--text-muted)]">{sharedCopy.terms}</p>
    </section>
  )
}
