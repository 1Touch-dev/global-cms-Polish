export const SITE_HOST = 'bialoczerwoni.live'
export const ARTICLE_PATH_PREFIX = '/news'
export const CMS_API_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL?.replace(/\/$/, '').trim() ||
  'https://api.golazopro.com/api'

export function demoteBodyH1(html: string): string {
  return html.replace(/<h1(\s[^>]*)?>/gi, '<h2$1>').replace(/<\/h1>/gi, '</h2>')
}

export function stripHost(host: string): string {
  return host.replace(/^www\./, '').toLowerCase()
}

export function articlePublicPath(locale: string, slug: string): string {
  return `/${locale}${ARTICLE_PATH_PREFIX}/${slug}`
}

export function resolveCanonicalUrl(
  cmsCanonical: string | undefined,
  locale: string,
  slug: string,
  host = SITE_HOST,
): string {
  const built = `https://${host}${articlePublicPath(locale, slug)}`
  if (!cmsCanonical) return built
  try {
    const url = new URL(cmsCanonical)
    if (stripHost(url.hostname) === stripHost(host)) return cmsCanonical.split('#')[0]
  } catch {
    /* ignore */
  }
  return built
}

export function isSameHostUrl(href: string, host = SITE_HOST): boolean {
  if (!href) return false
  if (href.startsWith('/') && !href.startsWith('//')) return true
  try {
    return stripHost(new URL(href, `https://${host}`).hostname) === stripHost(host)
  } catch {
    return false
  }
}

export function filterSameHostLinks(
  links: { text: string; url: string }[] | undefined,
  host = SITE_HOST,
): { text: string; url: string }[] {
  return (links ?? []).filter((link) => isSameHostUrl(link.url, host))
}

export function mergeJsonLdGraph(
  cmsNodes: Record<string, unknown>[] | undefined,
  extras: Record<string, unknown>[] = [],
): Record<string, unknown>[] {
  const nodes = [...(cmsNodes ?? [])]
  const keyOf = (node: Record<string, unknown>) =>
    `${String(node['@type'] ?? '')}|${String(node['@id'] ?? '')}`
  const seen = new Set(nodes.map(keyOf))
  for (const extra of extras) {
    const key = keyOf(extra)
    if (seen.has(key)) continue
    if (nodes.some((n) => n['@type'] === extra['@type'])) continue
    nodes.push(extra)
    seen.add(key)
  }
  return nodes
}

export function parseCmsRedirects(payload: unknown): { from: string; to: string }[] {
  const record = payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : null
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(record?.data)
      ? record.data
      : Array.isArray(record?.redirects)
        ? record.redirects
        : Array.isArray(record?.items)
          ? record.items
          : []
  return list
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const rec = item as Record<string, unknown>
      const from = String(rec.from ?? rec.fromPath ?? rec.source ?? rec.oldPath ?? rec.previousSlug ?? '')
      const to = String(rec.to ?? rec.toUrl ?? rec.destination ?? rec.canonicalUrl ?? rec.newPath ?? rec.slug ?? '')
      if (!from || !to) return null
      return { from, to }
    })
    .filter((item): item is { from: string; to: string } => Boolean(item))
}

export function dialectFromLocale(locale: string): string {
  return locale === 'en' ? 'en-US' : 'pl-PL'
}

export function faqHeadingForDialect(dialectCode?: string): string {
  const lang = (dialectCode ?? 'pl').toLowerCase().split('-')[0]
  return lang === 'en' ? 'Frequently Asked Questions' : 'Najczęściej zadawane pytania'
}
