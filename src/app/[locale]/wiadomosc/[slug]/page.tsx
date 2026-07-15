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
import { SITE_URL } from '@/lib/metadata'
import { generateSeoMetadata } from '@/lib/seo/generateSeoMetadata'

const ARTICLE_PATH_PREFIX = '/wiadomosc'

/** Demote any <h1> tags inside CMS-provided HTML to <h2> so the page has exactly one <h1>. */
function demoteBodyH1(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, '<h2$1>')
    .replace(/<\/h1>/gi, '</h2>')
}

/** Convert markdown image syntax ![alt](url) to <img> tags, preserving surrounding text. */
function processMarkdownImages(html: string): string {
  return html.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g,
    (_, alt: string, src: string) =>
      `<img src="${src}" alt="${alt || ''}" class="w-full rounded-xl object-cover my-6" loading="lazy" />`,
  )
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
  const image = article.seo?.image || article.imageUrls?.[0] || thumb

  // Use CMS seo.meta_title / seo.meta_description when available, fall back to resolved
  const metaTitle = article.seo?.meta_title || resolved.seoTitle
  const metaDescription = article.seo?.meta_description || resolved.seoDescription
  const canonicalPath = `${ARTICLE_PATH_PREFIX}/${slug}`
  const publishedTime = article.scheduledTime || article.publishedAt || article.createdAt

  return {
    ...generateSeoMetadata({
      title: metaTitle,
      description: metaDescription,
      locale,
      path: canonicalPath,
      image,
      type: 'article',
      publishedTime,
      modifiedTime: article.updatedAt,
    }),
    keywords: article.seo?.keywords,
    authors: [{ name: resolved.authorName }],
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      locale: locale === 'en' ? 'en_US' : 'pl_PL',
      type: 'article',
      publishedTime,
      modifiedTime: article.updatedAt,
      authors: [resolved.authorName],
      tags: resolved.tags,
      ...(image && { images: [{ url: image, alt: resolved.title }] }),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: metaTitle,
      description: metaDescription,
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
  const canonicalUrl = `${SITE_URL}/${locale}${ARTICLE_PATH_PREFIX}/${article.slug}`
  const related = await fetchBialoCzerwoniRelatedArticles(article, { limit: 3 })
  const extraImages = (article.imageUrls || []).filter((url) => url && url !== thumb)

  // Build the JSON-LD @graph: merge CMS-provided seoJsonLd with a BreadcrumbList node
  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: locale === 'pl' ? 'Strona główna' : 'Home', item: `${SITE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: locale === 'pl' ? 'Aktualności' : 'News', item: `${SITE_URL}/${locale}/wiadomosc` },
      { '@type': 'ListItem', position: 3, name: resolved.title, item: canonicalUrl },
    ],
  }

  const cmsNodes: Record<string, unknown>[] = article.seoJsonLd ?? []
  // Merge CMS nodes + breadcrumb into one @graph (dedupe by @type is implicit — CMS already has NewsArticle/FAQPage)
  const graphNodes: Record<string, unknown>[] = [...cmsNodes, breadcrumbNode]

  const jsonLdPayload =
    graphNodes.length === 1
      ? { '@context': 'https://schema.org', ...graphNodes[0] }
      : { '@context': 'https://schema.org', '@graph': graphNodes }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      {/* Merged JSON-LD: CMS seoJsonLd + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
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

        {/* Exactly ONE <h1> on the page, equal to article.title */}
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
            {formatDatePl(
              article.scheduledTime || resolved.publishedAt,
              { day: '2-digit', month: 'long', year: 'numeric' },
            )}
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

      {/* Body: prefer editorJsContent (if the field ever exists), otherwise sanitized HTML with H1 demotion */}
      <Card className="p-6 md:p-8">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: processMarkdownImages(demoteBodyH1(resolved.content)) }}
        />
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
