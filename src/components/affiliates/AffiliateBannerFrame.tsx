'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { type BannerVariant, getAffiliateCopy, getBannerSlides } from './AffiliateConfig'

interface AffiliateBannerFrameProps {
  locale: string
  variant?: BannerVariant
  className?: string
}

const ROTATE_MS = 8000

function scaledSize(width: number, height: number, containerWidth: number) {
  const scale = Math.min(1, containerWidth / width)
  return { scale, width: Math.ceil(width * scale), height: Math.ceil(height * scale) }
}

export default function AffiliateBannerFrame({
  locale,
  variant = 'horizontal',
  className = '',
}: AffiliateBannerFrameProps) {
  const copy = getAffiliateCopy(locale)
  const slides = useMemo(() => getBannerSlides(variant), [variant])
  const frameRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useLayoutEffect(() => {
    const element = frameRef.current
    if (!element) return
    const update = () => {
      const nextWidth = element.clientWidth || element.getBoundingClientRect().width
      if (nextWidth > 0) setContainerWidth(nextWidth)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const layout = useMemo(() => {
    const measureWidth = containerWidth || slides[0]?.width || 800
    const items = slides.map((slide) => {
      const { scale, width, height } = scaledSize(slide.width, slide.height, measureWidth)
      return { ...slide, scale, scaledWidth: width, scaledHeight: height }
    })
    const stageHeight = Math.max(...items.map((item) => item.scaledHeight), 0)
    return { stageHeight, items }
  }, [containerWidth, slides])

  const goNext = useCallback(() => {
    setIndex((current) => (current + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const timer = window.setInterval(goNext, ROTATE_MS)
    return () => window.clearInterval(timer)
  }, [goNext, paused, slides.length])

  const active = layout.items[index] ?? layout.items[0]
  const showControls = slides.length > 1

  return (
    <aside
      className={`overflow-hidden border border-[var(--border)] bg-[var(--surface)] ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-3 py-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">{copy.notice}</span>
        <span className="text-[10px] text-[var(--text-muted)]">{active?.provider ?? slides[0]?.provider}</span>
      </div>

      <div ref={frameRef} className="relative bg-black/10 px-2 py-3">
        <div className="relative mx-auto w-full" style={{ minHeight: layout.stageHeight || undefined }}>
          {layout.items.map((slide, slideIndex) => (
            <div
              key={`${slide.provider}-${slideIndex}`}
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-500 ease-in-out"
              style={{
                opacity: slideIndex === index ? 1 : 0,
                pointerEvents: slideIndex === index ? 'auto' : 'none',
              }}
              aria-hidden={slideIndex !== index}
            >
              {slide.kind === 'iframe' ? (
                <div className="relative mx-auto overflow-hidden" style={{ width: slide.scaledWidth, height: slide.scaledHeight }}>
                  <iframe
                    src={slide.src}
                    width={slide.width}
                    height={slide.height}
                    title={`${slide.provider} ${copy.notice}`}
                    scrolling="no"
                    frameBorder={0}
                    className="absolute left-1/2 top-0 block"
                    style={{
                      padding: 0, margin: 0, border: 0, borderStyle: 'none',
                      width: slide.width, height: slide.height, overflow: 'hidden',
                      transform: `translateX(-50%) scale(${slide.scale})`,
                      transformOrigin: 'top center',
                    }}
                  />
                </div>
              ) : (
                <a
                  href={slide.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="relative mx-auto block overflow-hidden leading-none"
                  style={{ width: slide.scaledWidth, height: slide.scaledHeight }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.imageSrc}
                    alt=""
                    width={slide.width}
                    height={slide.height}
                    loading="lazy"
                    className="absolute left-1/2 top-0 block max-w-none"
                    style={{
                      width: slide.width, height: slide.height,
                      transform: `translateX(-50%) scale(${slide.scale})`,
                      transformOrigin: 'top center',
                    }}
                  />
                </a>
              )}
            </div>
          ))}
        </div>

        {showControls ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.provider}
                type="button"
                onClick={() => setIndex(slideIndex)}
                className={`h-1.5 rounded-full transition-all ${
                  slideIndex === index ? 'w-5 bg-[var(--accent)]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Show ${slide.provider} banner`}
                aria-current={slideIndex === index}
              />
            ))}
          </div>
        ) : null}
      </div>

      <p className="border-t border-[var(--border)] px-3 py-2 text-[10px] leading-relaxed text-[var(--text-muted)]">
        {copy.terms}
      </p>
    </aside>
  )
}
