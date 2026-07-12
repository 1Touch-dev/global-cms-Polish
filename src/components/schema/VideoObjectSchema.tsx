interface VideoObjectSchemaProps {
  name: string
  description: string
  thumbnailUrl?: string
  uploadDate: string
  /** ISO 8601 duration, e.g. "PT3M30S". Optional — omit if unknown. */
  duration?: string
  /** Direct file URL for self-hosted video */
  contentUrl?: string
  /** YouTube/Vimeo embed URL */
  embedUrl?: string
}

/**
 * Emits a VideoObject JSON-LD script tag.
 * Wire this alongside any page that renders a video embed.
 * Only rendered when at least one of contentUrl or embedUrl is provided.
 */
export function VideoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
  embedUrl,
}: VideoObjectSchemaProps) {
  if (!contentUrl && !embedUrl) return null

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    uploadDate,
    ...(thumbnailUrl && {
      thumbnailUrl,
      thumbnail: { '@type': 'ImageObject', url: thumbnailUrl },
    }),
    ...(duration && { duration }),
    ...(contentUrl && { contentUrl }),
    ...(embedUrl && { embedUrl }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
