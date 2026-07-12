import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Tag, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
import { VideoObjectSchema } from '@/components/schema/VideoObjectSchema'
import { generateSeoMetadata } from '@/lib/seo/generateSeoMetadata'
import { BreadcrumbSchema } from '@/components/schema/BreadcrumbSchema'

/** Extract YouTube embed URL from a raw YouTube watch/share URL */
function toYoutubeEmbed(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : undefined
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop()
      return id ? `https://www.youtube.com/embed/${id}` : undefined
    }
  } catch { /* no-op */ }
  return undefined
}

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

  return {
    ...generateSeoMetadata({
      title: resolved.seoTitle,
      description: resolved.seoDescription,
      locale,
      path: `/wiadomosc/${slug}`,
      image,
      type: 'article',
      publishedTime: resolved.publishedAt,
      modifiedTime: article.updatedAt,
    }),
    // Preserve article-specific extra fields not covered by the shared utility
    keywords: article.seo?.keywords,
    authors: [{ name: resolved.authorName }],
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

  // Extra images beyond the cover thumbnail
  const extraImages = (article.imageUrls || []).filter((url) => url && url !== thumb)

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
      <BreadcrumbSchema
        crumbs={[
          { name: locale === 'pl' ? 'Strona główna' : 'Home', url: `${SITE_URL}/${locale}` },
          { name: locale === 'pl' ? 'Aktualności' : 'News', url: `${SITE_URL}/${locale}/news` },
          { name: resolved.title, url: canonicalUrl },
        ]}
      />
      {resolved.videoUrl && (
        <VideoObjectSchema
          name={resolved.title}
          description={resolved.seoDescription}
          thumbnailUrl={thumb}
          uploadDate={resolved.publishedAt}
          embedUrl={toYoutubeEmbed(resolved.videoUrl)}
          contentUrl={toYoutubeEmbed(resolved.videoUrl) ? undefined : resolved.videoUrl}
        />
      )}
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => (
              <span className="block my-6">
                <img
                  src={src}
                  alt={alt ?? ''}
                  className="w-full rounded-xl object-cover"
                />
              </span>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent)] underline underline-offset-2 hover:no-underline"
              >
                {children}
              </a>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mt-8 mb-3 text-[var(--text-main)]">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold mt-6 mb-2 text-[var(--text-main)]">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-[var(--text-muted)]">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-4 space-y-1 text-[var(--text-muted)]">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-4 space-y-1 text-[var(--text-muted)]">{children}</ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--text-muted)] my-4">
                {children}
              </blockquote>
            ),
          }}
        >
          {resolved.content}
        </ReactMarkdown>
      </Card>

      {extraImages.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-main)]">Galeria zdjęć</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {extraImages.map((url, i) => (
              <div key={url} className="relative aspect-video overflow-hidden rounded-xl">
                <img
                  src={url}
                  alt={`${resolved.title} — zdjęcie ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

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
            {related.map((item, index) => (
              <div key={item._id} className="relative">
                <span className="absolute -top-2.5 -left-2.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white shadow">
                  {index + 1}
                </span>
                <BcArticleCard article={item} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
