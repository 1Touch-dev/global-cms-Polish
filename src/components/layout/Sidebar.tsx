'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Trophy, Users, User, BarChart3, MapPin, Newspaper, Gamepad2 } from 'lucide-react'

export function Sidebar() {
  const t = useTranslations('nav')

  const sideLinks = [
    { href: '/wm-2026', label: t('wm2026'), icon: Trophy },
    { href: '/teams', label: t('teams'), icon: Users },
    { href: '/spieler', label: t('spieler'), icon: User },
    { href: '/statistiken', label: t('statistiken'), icon: BarChart3 },
    { href: '/stadien', label: t('stadien'), icon: MapPin },
    { href: '/vorhersage', label: t('vorhersage'), icon: Gamepad2 },
  ]

  return (
    <aside className="hidden xl:block w-64 bg-[var(--color-grau)] border-r border-(--color-border) min-h-screen p-4">
      <nav className="space-y-1">
        {sideLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-(--color-text-secondary) hover:text-[var(--color-aka)] hover:bg-(--color-surface-elevated) rounded-lg transition-colors"
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
