import { Link } from '@/i18n/routing'
import { BcArticleCard } from '@/components/cms/BcArticleCard'
import type { BialoCzerwoniArticle, BcListMeta } from '@/lib/bialoCzerwoniApi'
import type { SportEvent, SportLeague, SportTeam } from '@/lib/sportsdb'

export function VolleyballHub({
  locale,
  leagues,
  events,
  articles,
  meta,
  page,
}: {
  locale: string
  leagues: SportLeague[]
  events: SportEvent[]
  articles: BialoCzerwoniArticle[]
  meta: BcListMeta
  page: number
}) {
  const isPl = locale !== 'en'

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            🇵🇱 {isPl ? 'Sport dodatkowy' : 'Secondary sport'}
          </p>
          <h1 className="text-3xl text-[var(--text-main)] md:text-5xl">
            {isPl ? 'Siatkówka' : 'Volleyball'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            {isPl
              ? 'PlusLiga, ligi krajowe, nadchodzące mecze i aktualności. Piłka nożna pozostaje główna.'
              : 'PlusLiga, domestic leagues, upcoming games and news. Football coverage stays.'}
          </p>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl text-[var(--text-main)]">{isPl ? 'Nadchodzące mecze' : 'Upcoming games'}</h2>
        {events.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            {isPl ? 'Brak nadchodzących meczów siatkówki.' : 'No upcoming volleyball games right now.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={event.leagueId ? `/siatkowka/${event.leagueId}` : '/siatkowka'}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="line-clamp-2 text-sm text-[var(--text-main)]">{event.name}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{[event.date, event.time].filter(Boolean).join(' · ')}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="mb-6 text-2xl text-[var(--text-main)]">{isPl ? 'Ligi' : 'Leagues'}</h2>
        {leagues.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            {isPl ? 'Katalog lig siatkarskich jest pusty.' : 'Volleyball league catalog is empty right now.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {leagues.map((league) => (
              <Link
                key={league.id}
                href={`/siatkowka/${league.id}`}
                className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]"
              >
                {league.badge ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={league.badge} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <div className="h-10 w-10 rounded bg-[var(--surface-soft)]" />
                )}
                <p className="text-sm text-[var(--text-main)]">{league.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <VolleyballArticleGrid locale={locale} articles={articles} meta={meta} page={page} basePath="/siatkowka" />
    </div>
  )
}

export function VolleyballLeagueHub({
  locale,
  league,
  events,
  teams,
  articles,
  meta,
  page,
}: {
  locale: string
  league: SportLeague
  events: SportEvent[]
  teams: SportTeam[]
  articles: BialoCzerwoniArticle[]
  meta: BcListMeta
  page: number
}) {
  const isPl = locale !== 'en'

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--border)] bg-[var(--surface)] px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/siatkowka" className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {isPl ? '← Siatkówka' : '← Volleyball'}
          </Link>
          <div className="mt-3 flex items-center gap-4">
            {league.badge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={league.badge} alt="" className="h-16 w-16 object-contain" />
            ) : null}
            <div>
              <h1 className="text-3xl text-[var(--text-main)] md:text-5xl">{league.name}</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{league.country}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-2xl text-[var(--text-main)]">{isPl ? 'Nadchodzące mecze' : 'Upcoming games'}</h2>
        {events.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            {isPl ? 'Brak nadchodzących meczów tej ligi.' : 'No upcoming fixtures for this league.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <div key={event.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <p className="line-clamp-2 text-sm text-[var(--text-main)]">{event.name}</p>
                <p className="mt-2 text-xs text-[var(--text-muted)]">{[event.date, event.time].filter(Boolean).join(' · ')}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="mb-6 text-2xl text-[var(--text-main)]">{isPl ? 'Drużyny' : 'Teams'}</h2>
        {teams.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">{isPl ? 'Lista drużyn niedostępna.' : 'Team list is not available.'}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                {team.badge ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={team.badge} alt="" className="h-10 w-10 object-contain" />
                ) : (
                  <div className="h-10 w-10 rounded bg-[var(--surface-soft)]" />
                )}
                <p className="text-sm text-[var(--text-main)]">{team.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <VolleyballArticleGrid locale={locale} articles={articles} meta={meta} page={page} basePath={`/siatkowka/${league.id}`} />
    </div>
  )
}

function VolleyballArticleGrid({
  locale,
  articles,
  meta,
  page,
  basePath,
}: {
  locale: string
  articles: BialoCzerwoniArticle[]
  meta: BcListMeta
  page: number
  basePath: string
}) {
  const isPl = locale !== 'en'
  const totalPages = Math.max(1, meta.totalPages || 1)

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="mb-6 text-2xl text-[var(--text-main)]">{isPl ? 'Aktualności siatkówki' : 'Volleyball news'}</h2>
      {articles.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          {isPl ? 'Brak artykułów o siatkówce.' : 'No volleyball articles available yet.'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <BcArticleCard key={article._id} article={article} locale={locale} />
          ))}
        </div>
      )}
      {totalPages > 1 ? (
        <div className="mt-8 flex gap-3">
          {page > 1 ? (
            <Link href={`${basePath}?page=${page - 1}`} className="text-sm font-semibold text-[var(--accent)]">
              {isPl ? '← Poprzednia' : '← Previous'}
            </Link>
          ) : null}
          {page < totalPages ? (
            <Link href={`${basePath}?page=${page + 1}`} className="text-sm font-semibold text-[var(--accent)]">
              {isPl ? 'Następna →' : 'Next →'}
            </Link>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
