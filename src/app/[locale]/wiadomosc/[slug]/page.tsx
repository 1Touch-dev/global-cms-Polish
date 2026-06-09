import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Tag } from 'lucide-react'
import {
  fetchBialoCzerwoniArticleBySlug,
  bcThumbnail,
  formatDatePl,
} from '@/lib/bialoCzerwoniApi'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchBialoCzerwoniArticleBySlug(slug)
  if (!article) return { title: 'Artykuł nie znaleziony | Biało-Czerwoni' }

  const thumb = bcThumbnail(article)

  return {
    title: `${article.title} | Biało-Czerwoni`,
    description: article.summary || article.description,
    alternates: { canonical: `/wiadomosc/${slug}` },
    openGraph: {
      title: article.title,
      description: article.summary || article.description,
      locale: 'pl_PL',
      type: 'article',
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt,
      ...(thumb && { images: [{ url: thumb, alt: article.title }] }),
    },
  }
}

export const revalidate = 60

export default async function WiadomoscPage({ params }: Props) {
  const { slug } = await params
  const article = await fetchBialoCzerwoniArticleBySlug(slug)

  if (!article) notFound()

  const thumb = bcThumbnail(article)

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 lg:px-6">
      <Link
        href="/ms-2026"
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
      >
        <ArrowLeft className="h-4 w-4" /> Wróć
      </Link>

      <header className="space-y-6 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {article.category.map((cat) => (
            <Badge key={cat}>{cat}</Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold leading-tight text-[var(--text-main)] md:text-4xl lg:text-5xl">
          {article.title}
        </h1>

        {(article.summary || article.description) && (
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">
            {article.summary || article.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDatePl(article.createdAt, { day: '2-digit', month: 'long', year: 'numeric' })}
          </span>
          <span className="font-semibold text-[var(--accent)]">Biało-Czerwoni</span>
        </div>
      </header>

      {thumb && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-[20px]">
          <Image
            src={thumb}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <Card className="prose prose-invert max-w-none p-6 md:p-8">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </Card>

      {article.tags && article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
