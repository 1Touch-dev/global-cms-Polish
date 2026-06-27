import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Tag, User } from 'lucide-react'
import {
  fetchBialoCzerwoniArticleBySlug,
  fetchBialoCzerwoniRelatedArticles,
  bcPrimaryCategory,
  bcThumbnail,
  formatDatePl,
  resolveBcArticle,
} from '@/lib/bialoCzerwoniApi'
import { BcArticleCard } from '@/components/cms/BcArticleCard'
import { BcArticleSocials } from '@/components/cms/BcArticleSocials'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ArticleJsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/metadata'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await fetchBialoCzerwoniArticleBySlug(slug, locale)
  if (!article) return { title: 'Artykuł nie znaleziony | Biało-Czerwoni' }

  const resolved = resolveBcArticle(article, locale)
  const thumb = bcThumbnail(article)
  const image = article.seo?.image || thumb
  const canonical = `${SITE_URL}/${locale}/wiadomosc/${slug}`

  return {
    title: `${resolved.seoTitle} | Biało-Czerwoni`,
    description: resolved.seoDescription,
    keywords: article.seo?.keywords,
    authors: [{ name: resolved.authorName }],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
      languages: {
        pl: `${SITE_URL}/pl/wiadomosc/${slug}`,
        en: `${SITE_URL}/en/wiadomosc/${slug}`,
      },
    },
    openGraph: {
      title: resolved.seoTitle,
      description: resolved.seoDescription,
      locale: locale === 'en' ? 'en_US' : 'pl_PL',
      type: 'article',
      publishedTime: resolved.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [resolved.authorName],
      tags: resolved.tags,
      ...(image && { images: [{ url: image, alt: resolved.title }] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: resolved.seoTitle,
      description: resolved.seoDescription,
      ...(image && { images: [image] }),
    },
  }
}

export const revalidate = 60

export default async function WiadomoscPage({ params }: Props) {
  const { locale, slug } = await params
  const article = await fetchBialoCzerwoniArticleBySlug(slug, locale)

  if (!article) notFound()

  const resolved = resolveBcArticle(article, locale)
  const thumb = bcThumbnail(article)
  const canonicalUrl = `${SITE_URL}/${locale}/wiadomosc/${article.slug}`
  const related = await fetchBialoCzerwoniRelatedArticles(article, { limit: 3 })

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      <ArticleJsonLd
        title={resolved.title}
        description={resolved.seoDescription}
        url={canonicalUrl}
        imageUrl={thumb}
        publishedAt={resolved.publishedAt}
        updatedAt={article.updatedAt}
        authorName={resolved.authorName}
        tags={resolved.tags}
        locale={locale}
      />
      <Link
        href="/ms-2026"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
      >
        <ArrowLeft className="h-4 w-4" /> Wróć
      </Link>

      <header className="space-y-6 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{bcPrimaryCategory(article)}</Badge>
          {article.category?.filter((cat) => cat !== bcPrimaryCategory(article)).map((cat) => (
            <Badge key={cat}>{cat}</Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight text-[var(--text-main)] md:text-4xl lg:text-5xl">
          {resolved.title}
        </h1>

        {(resolved.summary || resolved.description) && (
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">
            {resolved.summary || resolved.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDatePl(resolved.publishedAt, { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)]">
            <User className="h-4 w-4" />
            {resolved.authorName}
          </span>
        </div>
      </header>

      {thumb && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-[20px]">
          <img
            src={thumb}
            alt={resolved.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <Card className="prose prose-invert max-w-none p-6 md:p-8">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: resolved.content }}
        />
      </Card>

      <BcArticleSocials
        title={resolved.title}
        canonicalUrl={canonicalUrl}
        videoUrl={resolved.videoUrl}
        twitterUrl={resolved.twitterUrl}
      />

      {resolved.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          {resolved.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <SectionHeader title="Powiązane artykuły" eyebrow="CMS Newsroom" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BcArticleCard key={item._id} article={item} locale={locale} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
