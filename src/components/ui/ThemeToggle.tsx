'use client'

import { MoonStar, SunMedium } from 'lucide-react'
import { useTheme } from '@/components/ui/ThemeProvider'

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Przełącz na jasny motyw' : 'Przełącz na ciemny motyw'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-main)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-neon)]"
      title={theme === 'dark' ? 'Motyw jasny' : 'Motyw ciemny'}
    >
      {mounted && theme === 'dark' ? (
        <SunMedium className="h-4.5 w-4.5" />
      ) : (
        <MoonStar className="h-4.5 w-4.5" />
      )}
    </button>
  )
}
