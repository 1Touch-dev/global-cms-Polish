'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const targetLocale = locale === 'pl' ? 'en' : 'pl'

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: targetLocale })}
      className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-xs font-semibold tracking-[0.18em] text-[var(--text-muted)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-neon)]"
      aria-label="Zmień język"
    >
      <span className={locale === 'pl' ? 'text-[var(--accent)]' : ''}>PL</span>
      <span className="opacity-50">/</span>
      <span className={locale === 'en' ? 'text-[var(--accent)]' : ''}>EN</span>
    </button>
  )
}
