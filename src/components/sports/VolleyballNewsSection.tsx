import { Link } from '@/i18n/routing'
import { BcArticleCard } from '@/components/cms/BcArticleCard'
import type { BialoCzerwoniArticle } from '@/lib/bialoCzerwoniApi'

export function VolleyballNewsSection({
  locale,
  articles,
}: {
  locale: string
  articles: BialoCzerwoniArticle[]
}) {
  const isPl = locale !== 'en'

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
            {isPl ? 'Sport dodatkowy' : 'Secondary sport'}
          </p>
          <h2 className="mt-1 text-2xl text-[var(--text-main)]">
            {isPl ? 'Aktualności siatkówki' : 'Volleyball news'}
          </h2>
        </div>
        <Link href="/siatkowka" className="text-sm font-semibold text-[var(--accent)]">
          {isPl ? 'Zobacz wszystkie →' : 'View all →'}
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          {isPl ? 'Brak artykułów o siatkówce.' : 'No volleyball articles available yet.'}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <BcArticleCard key={article._id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </section>
  )
}
