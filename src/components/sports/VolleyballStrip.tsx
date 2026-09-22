import { Link } from '@/i18n/routing'

export type VolleyballStripLeague = {
  id: string
  name: string
  badge: string | null
}

export type VolleyballStripEvent = {
  id: string
  name: string
  date: string
  time: string | null
  leagueId: string | null
}

export function VolleyballStrip({
  locale,
  events,
  leagues = [],
}: {
  locale: string
  events: VolleyballStripEvent[]
  leagues?: VolleyballStripLeague[]
}) {
  const isPl = locale !== 'en'

  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface)] py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              🇵🇱 {isPl ? 'Sport dodatkowy' : 'Secondary sport'}
            </p>
            <h2 className="text-2xl text-[var(--text-main)] md:text-3xl">
              {isPl ? 'Siatkówka' : 'Volleyball'}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
              {isPl
                ? 'PlusLiga i krajowa siatkówka. Piłka nożna pozostaje głównym sportem.'
                : 'PlusLiga and Polish volleyball. Football stays primary.'}
            </p>
          </div>
          <Link href="/siatkowka" className="shrink-0 text-sm font-semibold text-[var(--accent)]">
            {isPl ? 'Pełny hub →' : 'Full hub →'}
          </Link>
        </div>

        {leagues.length > 0 ? (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {leagues.slice(0, 6).map((league) => (
              <Link
                key={league.id}
                href={`/siatkowka/${league.id}`}
                className="min-h-[96px] rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 transition hover:border-[var(--accent)]"
              >
                {league.badge ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={league.badge} alt="" className="mb-2 h-10 w-10 object-contain" />
                ) : null}
                <p className="line-clamp-2 text-sm text-[var(--text-main)]">{league.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mb-8 text-sm text-[var(--text-muted)]">
            {isPl ? 'Katalog lig siatkarskich jest teraz pusty.' : 'No Polish volleyball leagues in the catalog right now.'}
          </p>
        )}

        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
          {isPl ? 'Nadchodzące mecze' : 'Upcoming games'}
        </h3>
        {events.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            {isPl ? 'Brak nadchodzących meczów siatkówki.' : 'No upcoming volleyball games right now.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {events.slice(0, 5).map((event) => (
              <Link
                key={event.id}
                href={event.leagueId ? `/siatkowka/${event.leagueId}` : '/siatkowka'}
                className="min-h-[88px] rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition hover:border-[var(--accent)]"
              >
                <p className="line-clamp-2 text-sm text-[var(--text-main)]">{event.name}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {[event.date, event.time].filter(Boolean).join(' · ')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
