import { ExternalLink, Share2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'

function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v') || parsed.pathname.split('/').pop()
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }

  return null
}

interface BcArticleSocialsProps {
  title: string
  canonicalUrl: string
  videoUrl?: string
  twitterUrl?: string
}

export function BcArticleSocials({
  title,
  canonicalUrl,
  videoUrl,
  twitterUrl,
}: BcArticleSocialsProps) {
  const encodedUrl = encodeURIComponent(canonicalUrl)
  const encodedTitle = encodeURIComponent(title)
  const embedUrl = videoUrl ? youtubeEmbedUrl(videoUrl) : null
  const shareLinks = [
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ]

  if (!embedUrl && !videoUrl && !twitterUrl) {
    return (
      <Card className="mt-8 space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
          <Share2 className="h-4 w-4 text-[var(--accent)]" />
          Udostępnij
        </div>
        <div className="flex flex-wrap gap-2">
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="mt-8 space-y-5">
      {embedUrl ? (
        <div className="overflow-hidden rounded-[20px] border border-[var(--border)] bg-black shadow-[var(--shadow-soft)]">
          <iframe
            src={embedUrl}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : videoUrl ? (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
        >
          <ExternalLink className="h-4 w-4" />
          Otwórz wideo
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      ) : null}

      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-main)]">
          <Share2 className="h-4 w-4 text-[var(--accent)]" />
          Udostępnij
        </div>
        <div className="flex flex-wrap gap-2">
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:border-[var(--accent)]"
            >
              Źródło X
            </a>
          )}
          {shareLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[var(--border)] bg-[var(--surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--text-main)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
