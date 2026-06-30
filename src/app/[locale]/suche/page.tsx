'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Users, User, MapPin } from 'lucide-react'
import { Link } from '@/i18n/routing'

interface ApiTeam {
  id: number
  name: string
  kurzname: string
  flagge: string
  gruppe?: string
}

interface ApiStadion {
  id: string
  name: string
  stadt: string
  land: string
  kapazitaet: number
}

interface ApiPlayer {
  id: number
  name: string
  team: string
  position: string
  photo?: string
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export default function SuchePage() {
  const t = useTranslations('suche')
  const tNav = useTranslations('nav')
  const locale = useLocale()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 400)
  const inputRef = useRef<HTMLInputElement>(null)

  const [allTeams, setAllTeams] = useState<ApiTeam[]>([])
  const [allStadien, setAllStadien] = useState<ApiStadion[]>([])
  const [apiPlayers, setApiPlayers] = useState<ApiPlayer[]>([])
  const [loadingPlayers, setLoadingPlayers] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Load teams and stadiums once on mount
  useEffect(() => {
    fetch('/api/teams')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const response: any[] = data?.response || (Array.isArray(data) ? data : [])
        const teams: ApiTeam[] = response.map((item: any) => ({
          id: item.team?.id ?? item.id,
          name: item.team?.name ?? item.name ?? '',
          kurzname: item.team?.code ?? item.kurzname ?? '',
          flagge: item.team?.logo ?? item.flagge ?? '',
          gruppe: item.gruppe ?? '',
        })).filter(t => t.id && t.name)
        setAllTeams(teams)
      })
      .catch(() => {})

    fetch('/api/stadien')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (Array.isArray(data)) setAllStadien(data)
      })
      .catch(() => {})
  }, [])

  // Fetch players when query is long enough
  useEffect(() => {
    if (debouncedQuery.length < 3) {
      setApiPlayers([])
      return
    }
    setLoadingPlayers(true)
    fetch(`/api/spieler?search=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const players: ApiPlayer[] = (data?.response || []).slice(0, 10).map((p: any) => ({
          id: p.player?.id,
          name: p.player?.name || '',
          team: p.statistics?.[0]?.team?.name || '',
          position: p.statistics?.[0]?.games?.position || '',
          photo: p.player?.photo,
        }))
        setApiPlayers(players)
      })
      .catch(() => setApiPlayers([]))
      .finally(() => setLoadingPlayers(false))
  }, [debouncedQuery])

  const results = useMemo(() => {
    if (debouncedQuery.length < 2) return null
    const q = debouncedQuery.toLowerCase()
    const teams = allTeams.filter(
      team => team.name.toLowerCase().includes(q) || team.kurzname.toLowerCase().includes(q)
    )
    const stadiums = allStadien.filter(
      s => s.name.toLowerCase().includes(q) || s.stadt.toLowerCase().includes(q)
    )
    return { teams, players: apiPlayers, stadiums }
  }, [debouncedQuery, apiPlayers, allTeams, allStadien])

  const totalResults = results
    ? results.teams.length + results.players.length + results.stadiums.length
    : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-aka)] tracking-wide mb-8">
        {tNav('suche')}
      </h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--color-text-muted)" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full pl-12 pr-4 py-4 bg-[var(--color-grau)] border border-(--color-border) rounded-xl text-(--color-text-primary) placeholder-gray-500 focus:outline-none focus:border-[var(--color-aka)] focus:ring-1 focus:ring-[var(--color-aka)]/20 transition-all"
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-muted) hover:text-(--color-text-primary) text-sm"
          >
            ✕
          </button>
        )}
      </div>

      {results ? (
        <div className="space-y-6">
          <p className="text-(--color-text-muted) text-sm">
            {loadingPlayers
              ? t('laden')
              : t('ergebnisse', { count: totalResults, query: debouncedQuery })}
          </p>

          {results.teams.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-aka)] uppercase tracking-wider mb-3">
                <Users className="w-4 h-4" /> {t('mannschaften')}
              </h2>
              <div className="space-y-2">
                {results.teams.map(team => (
                  <Link key={team.id} href={`/teams/${team.id}`}>
                    <div className="flex items-center gap-3 p-3 bg-[var(--color-grau)] rounded-lg border border-(--color-border) hover:border-[var(--color-aka)] transition-colors">
                      {team.flagge && team.flagge.startsWith('http') ? (
                        <img src={team.flagge} alt={team.name} className="w-6 h-6 object-contain" />
                      ) : (
                        <span className="text-xl">{team.flagge}</span>
                      )}
                      <div>
                        <p className="text-(--color-text-primary) font-medium text-sm">{team.name}</p>
                        {team.gruppe && (
                          <p className="text-(--color-text-muted) text-xs">
                            {t('gruppe', { name: team.gruppe })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.players.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-aka)] uppercase tracking-wider mb-3">
                <User className="w-4 h-4" /> {t('spieler')}
              </h2>
              <div className="space-y-2">
                {results.players.map(player => (
                  <Link key={player.id} href={`/spieler/${player.id}`}>
                    <div className="flex items-center gap-3 p-3 bg-[var(--color-grau)] rounded-lg border border-(--color-border) hover:border-[var(--color-aka)] transition-colors">
                      {player.photo ? (
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover border border-(--color-border)"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-(--color-surface-2) flex items-center justify-center text-xs font-bold text-[var(--color-aka)]">
                          {player.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="text-(--color-text-primary) font-medium text-sm">{player.name}</p>
                        <p className="text-(--color-text-muted) text-xs">
                          {player.team}
                          {player.position ? ` • ${player.position}` : ''}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.stadiums.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-aka)] uppercase tracking-wider mb-3">
                <MapPin className="w-4 h-4" /> {t('stadien')}
              </h2>
              <div className="space-y-2">
                {results.stadiums.map(stadion => (
                  <div
                    key={stadion.id}
                    className="flex items-center gap-3 p-3 bg-[var(--color-grau)] rounded-lg border border-(--color-border)"
                  >
                    <MapPin className="w-4 h-4 text-[var(--color-aka)]" />
                    <div>
                      <p className="text-(--color-text-primary) font-medium text-sm">{stadion.name}</p>
                      <p className="text-(--color-text-muted) text-xs">
                        {stadion.stadt}, {stadion.land} •{' '}
                        {stadion.kapazitaet.toLocaleString(locale)} {t('stadien')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && !loadingPlayers && (
            <div className="text-center py-12">
              <p className="text-(--color-text-muted)">{t('keine_ergebnisse')}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-(--color-text-secondary) mx-auto mb-4" />
          <p className="text-(--color-text-muted)">{t('placeholder')}</p>
          <p className="text-(--color-text-secondary) text-sm mt-2">{t('min_zeichen')}</p>
        </div>
      )}
    </div>
  )
}
