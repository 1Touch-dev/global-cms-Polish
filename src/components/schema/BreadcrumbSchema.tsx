export interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  crumbs: BreadcrumbItem[]
}

/**
 * Renders a BreadcrumbList JSON-LD script tag.
 * Inject on deep pages: articles, match details, team pages, etc.
 */
export function BreadcrumbSchema({ crumbs }: BreadcrumbSchemaProps) {
  if (!crumbs.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(({ name, url }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
