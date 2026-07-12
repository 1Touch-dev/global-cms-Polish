import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'
export const SITE_NAME = 'Biało-Czerwoni | Matchday Arena'

/**
 * All supported locales for this property.
 * Used to generate hreflang alternate links.
 */
export const SUPPORTED_LOCALES = ['pl', 'en'] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function localeToOgLocale(locale: string): string {
  return locale === 'en' ? 'en_US' : 'pl_PL'
}

function alternateLocale(locale: string): string {
  return locale === 'en' ? 'pl_PL' : 'en_US'
}

interface GenerateSeoMetadataParams {
  title: string
  description: string
  locale: string
  /** Relative path including leading slash, e.g. "/wm-2026" */
  path: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Single source of truth for all page metadata.
 * Generates title, description, canonical URL, OG, Twitter card,
 * and hreflang alternate links for all supported locales.
 */
export function generateSeoMetadata({
  title,
  description,
  locale,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
}: GenerateSeoMetadataParams): Metadata {
  const canonical = `${SITE_URL}/${locale}${path === '/' ? '' : path}`

  // hreflang alternates — one per supported locale + x-default (pointing to default locale)
  const languages: Record<string, string> = {}
  for (const loc of SUPPORTED_LOCALES) {
    languages[loc] = `${SITE_URL}/${loc}${path === '/' ? '' : path}`
  }
  languages['x-default'] = `${SITE_URL}/pl${path === '/' ? '' : path}`

  const og: Metadata['openGraph'] = {
    title,
    description,
    url: canonical,
    siteName: SITE_NAME,
    locale: localeToOgLocale(locale),
    alternateLocale: alternateLocale(locale),
    type: type === 'article' ? 'article' : 'website',
    ...(image && { images: [{ url: image, alt: title }] }),
    ...(type === 'article' && publishedTime && { publishedTime }),
    ...(type === 'article' && modifiedTime && { modifiedTime }),
  }

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical, languages },
    openGraph: og,
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && { images: [image] }),
    },
  }
}
