'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { Menu, X, Search, Trophy, Newspaper, LayoutGrid, Flag } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  const primaryLinks = [
    { href: '/reprezentacja', label: t('nationalTeam'), icon: Flag },
    { href: '/transfery', label: t('transfers') },
    { href: '/zawodnicy', label: t('spieler') },
    { href: '/strzelcy', label: t('torschuetzen') },
    { href: '/stadiony', label: t('stadien') },
    { href: '/inne', label: t('other') },
    { href: '/news', label: t('news'), icon: Newspaper },
    { href: '/siatkowka', label: t('volleyball') },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_82%,transparent)] backdrop-blur-2xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
            <Trophy className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-main)]">Biało-Czerwoni</p>
            <p className="text-xs text-[var(--text-muted)]">bialoczerwoni.live</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map((link) => {
            const Icon = 'icon' in link ? link.icon : null
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-neon)] ${
                  active ? 'bg-[var(--surface-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/suche"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            aria-label={t('search')}
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] transition hover:border-[var(--accent)] lg:hidden"
            aria-label={t('menu')}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)]/96 px-4 py-4 backdrop-blur-2xl lg:hidden">
          <div className="space-y-2">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'border-[var(--accent)]/30 bg-[var(--surface-soft)] text-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {'icon' in link && link.icon ? <link.icon className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4 opacity-0" />}
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
