'use client'

import { useEffect, useMemo, useState } from 'react'
import type { BialoCzerwoniBanner } from '@/lib/bialoCzerwoniApi'

const BC_BANNER_CSS = `
.bc-banner-html .card-banner,.bc-banner-html .link,.bc-banner-html .card{display:flex!important;flex-direction:column!important;height:100%!important;width:100%!important;text-decoration:none!important;color:inherit!important}
.bc-banner-html .card{background:var(--surface)!important;border:1px solid rgba(22,163,74,0.2)!important;border-radius:14px!important;overflow:hidden!important;box-shadow:0 2px 8px rgba(7,17,31,0.06)!important;transition:border-color .18s,box-shadow .18s,transform .18s!important}
.bc-banner-html .card:hover{border-color:#16a34a!important;box-shadow:0 4px 20px rgba(22,163,74,0.12)!important;transform:translateY(-2px)!important}
.bc-banner-html .img-area{width:100%!important;height:210px!important;overflow:hidden!important;position:relative!important;flex-shrink:0!important;background:var(--surface-soft)!important}
.bc-banner-html .img-area img,.bc-banner-html .img-area .img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;transition:transform .55s cubic-bezier(.25,.46,.45,.94)!important}
.bc-banner-html .card:hover .img-area img,.bc-banner-html .card:hover .img-area .img{transform:scale(1.06)!important}
.bc-banner-html .body{padding:14px 14px 12px!important;flex:1!important;display:flex!important;flex-direction:column!important}
.bc-banner-html .tags{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin-bottom:0!important}
.bc-banner-html .tag{display:inline-block!important;background:#16a34a!important;color:#fff!important;font-size:11px!important;font-weight:700!important;padding:3px 10px!important;border-radius:50px!important;white-space:nowrap!important;line-height:1.4!important}
.bc-banner-html .divider{height:1px!important;background:rgba(0,0,0,0.08)!important;margin:10px 0!important}
.bc-banner-html .title{color:var(--text-main)!important;font-weight:700!important;font-size:14px!important;line-height:1.4!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:3!important;overflow:hidden!important;flex:1!important}
.bc-banner-html *{color:var(--text-main)!important}
.bc-banner-html .tag{color:#fff!important}
.bc-banner-html .footer{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;margin-top:10px!important}
.bc-banner-html .domain{font-size:12px!important;color:var(--text-muted)!important}
.bc-banner-html .logo-text{font-size:12px!important;font-weight:800!important;color:#0b6623!important}
.bc-banner-html .logo-block-text,.bc-banner-html .logo-block-image{background:rgba(22,163,74,0.05)!important;border:1px solid rgba(22,163,74,0.15)!important;border-radius:10px!important;padding:4px 8px!important}
`

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

interface BannerCarouselProps {
  banners: BialoCzerwoniBanner[]
  locale?: string
}

const PER_PAGE = 3

export default function BannerCarousel({ banners, locale = 'pl' }: BannerCarouselProps) {
  const [page, setPage] = useState(0)

  const items = useMemo(
    () => banners.filter((b) => b.htmlContent).slice(0, 10),
    [banners],
  )

  const totalPages = Math.ceil(items.length / PER_PAGE)

  useEffect(() => {
    if (totalPages <= 1) return
    const id = setInterval(() => setPage((p) => (p + 1) % totalPages), 5000)
    return () => clearInterval(id)
  }, [totalPages])

  if (items.length === 0) return null

  const activePage = page % totalPages
  const visible = items.slice(activePage * PER_PAGE, activePage * PER_PAGE + PER_PAGE)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: BC_BANNER_CSS }} />
      <div
        className="mb-8 rounded-2xl px-4 py-5"
        style={{
          background: 'var(--bg)',
          border: '1px solid rgba(22,163,74,0.18)',
          boxShadow: '0 2px 12px rgba(7,17,31,0.06)',
        }}
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: '#16a34a' }}>
            {locale === 'pl' ? 'Wyróżnione Artykuły' : 'Featured Articles'}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button type="button"
                onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ border: '1px solid rgba(22,163,74,0.25)', color: '#5b6878' }}
                aria-label="Wstecz">
                <ChevronLeft />
              </button>
              <button type="button"
                onClick={() => setPage((p) => (p + 1) % totalPages)}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ border: '1px solid rgba(22,163,74,0.25)', color: '#5b6878' }}
                aria-label="Dalej">
                <ChevronRight />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {visible.map((b) => (
            <div key={b._id} className="bc-banner-html overflow-hidden"
              dangerouslySetInnerHTML={{ __html: b.htmlContent! }} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} type="button" onClick={() => setPage(i)}
                className="h-2 rounded-full transition-all"
                style={{ width: i === activePage ? '28px' : '8px', background: i === activePage ? '#16a34a' : 'rgba(0,0,0,0.15)' }}
                aria-label={`Str. ${i + 1}`} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
