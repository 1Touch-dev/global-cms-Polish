'use client'

import { useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface BcNewsSearchBarProps {
  initialValue?: string
  placeholder?: string
}

export function BcNewsSearchBar({
  initialValue = '',
  placeholder = 'Szukaj artykułów...',
}: BcNewsSearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      const query = value.trim()
      const currentQuery = params.get('szukaj') || ''

      if (query === currentQuery) return

      if (query) params.set('szukaj', query)
      else params.delete('szukaj')

      params.delete('strona')
      const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    }, 300)

    return () => window.clearTimeout(handle)
  }, [pathname, router, searchParams, value])

  return (
    <label className="relative block w-full max-w-md">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-11 text-sm text-[var(--text-main)] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-neon)]/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-main)]"
          aria-label="Wyczyść wyszukiwanie"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isPending && (
        <span className="absolute -bottom-5 left-4 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Szukam...
        </span>
      )}
    </label>
  )
}
