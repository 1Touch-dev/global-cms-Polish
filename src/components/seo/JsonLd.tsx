import { SITE_URL } from '@/lib/metadata'

interface SportEventJsonLdProps {
  locale: string
}

export function HomeJsonLd({ locale }: SportEventJsonLdProps) {
  const isPl = locale !== 'en'

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isPl ? 'Biało-Czerwoni | Matchday Arena' : 'Matchday Arena',
    url: SITE_URL,
    description: isPl
      ? 'Polski portal piłkarski z wynikami na żywo, terminarzem MS 2026 i statystykami.'
      : 'Football portal with live scores, World Cup 2026 schedule and statistics.',
    inLanguage: isPl ? 'pl-PL' : 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/suche?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const sportEventSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: isPl ? 'Mistrzostwa Świata FIFA 2026' : 'FIFA World Cup 2026',
    description: isPl
      ? '48 drużyn, 104 mecze, 16 stadionów w USA, Kanadzie i Meksyku.'
      : '48 teams, 104 matches, 16 stadiums across USA, Canada and Mexico.',
    startDate: '2026-06-11',
    endDate: '2026-07-19',
    location: [
      { '@type': 'Place', name: 'MetLife Stadium', address: 'East Rutherford, NJ, USA' },
      { '@type': 'Place', name: 'SoFi Stadium', address: 'Inglewood, CA, USA' },
      { '@type': 'Place', name: 'Estadio Azteca', address: 'Mexico City, Mexico' },
    ],
    organizer: {
      '@type': 'Organization',
      name: 'FIFA',
      url: 'https://www.fifa.com',
    },
    url: `${SITE_URL}/${locale}${isPl ? '/ms-2026' : '/wm-2026'}`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isPl ? 'Strona główna' : 'Home',
        item: `${SITE_URL}/${locale}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportEventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  imageUrl?: string
  publishedAt: string
  updatedAt: string
  authorName: string
  tags?: string[]
  locale: string
}

export function ArticleJsonLd({
  title,
  description,
  url,
  imageUrl,
  publishedAt,
  updatedAt,
  authorName,
  tags,
  locale,
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Biało-Czerwoni',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
      },
    },
    inLanguage: locale === 'en' ? 'en-US' : 'pl-PL',
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
    ...(tags?.length && { keywords: tags.join(', ') }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
