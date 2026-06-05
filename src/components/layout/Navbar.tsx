'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { Menu, X, Search, Trophy, ChevronDown, Newspaper, LayoutGrid } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function Navbar() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'wm' | 'ligen' | null>(null)

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  const primaryLinks = [
    { href: '/wm-2026', label: t('wm2026'), hasDropdown: true, key: 'wm' as const },
    { href: '/teams', label: t('teams') },
    { href: '/spieler', label: t('spieler') },
    { href: '/spiele', label: t('spiele') },
    { href: '/statistiken', label: t('statistiken') },
    { href: '/ligen', label: t('ligen'), hasDropdown: true, key: 'ligen' as const },
    { href: '/news', label: t('news'), icon: Newspaper },
  ]

  const wmSubLinks = [
    { href: '/wm-2026/gruppen', label: t('gruppen') },
    { href: '/wm-2026/spielplan', label: t('spielplan') },
    { href: '/wm-2026/ergebnisse', label: t('ergebnisse') },
    { href: '/wm-2026/bracket', label: t('bracket') },
  ]

  const leagueLinks = [
    { href: '/ligen/bundesliga', label: t('bundesliga') },
    { href: '/ligen/champions-league', label: t('championsLeague') },
    { href: '/ligen/premier-league', label: t('premierLeague') },
    { href: '/ligen/la-liga', label: t('laLiga') },
    { href: '/ligen/serie-a', label: t('serieA') },
    { href: '/ligen/ligue-1', label: t('ligue1') },
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
            <p className="text-sm font-semibold text-[var(--text-main)]">Matchday Arena</p>
            <p className="text-xs text-[var(--text-muted)]">Polska piłkarska redakcja</p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {primaryLinks.map((link) => {
            const Icon = 'icon' in link ? link.icon : null
            const active = isActive(link.href)
            return (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => {
                  if ('key' in link && link.key) setOpenMenu(link.key)
                }}
                onMouseLeave={() => {
                  if ('key' in link) setOpenMenu(null)
                }}
              >
                <Link
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-neon)] ${
                    active ? 'bg-[var(--surface-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {link.label}
                  {'hasDropdown' in link && link.hasDropdown && <ChevronDown className={`h-4 w-4 transition ${openMenu === link.key ? 'rotate-180' : ''}`} />}
                </Link>

                {'key' in link && openMenu === link.key && (
                  <div className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-strong)]">
                    <div className="p-2">
                      {(link.key === 'wm' ? wmSubLinks : leagueLinks).map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-main)]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--bg)]/96 px-4 py-4 backdrop-blur-2xl lg:hidden">
          <div className="space-y-2">
            {primaryLinks.map((link) => (
              <div key={link.href} className="space-y-2">
                <Link
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
                  {'hasDropdown' in link && link.hasDropdown && <ChevronDown className="h-4 w-4" />}
                </Link>
                {'key' in link && (
                  <div className="ml-3 space-y-1 border-l border-[var(--border)] pl-3">
                    {(link.key === 'wm' ? wmSubLinks : leagueLinks).map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-main)]"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
