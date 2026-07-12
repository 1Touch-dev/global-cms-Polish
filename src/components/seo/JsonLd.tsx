import { SITE_URL } from '@/lib/metadata'

// ── Task 3: NewsMediaOrganization — injected once in root layout ──────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Biało-Czerwoni | Matchday Arena',
    alternateName: 'Matchday Arena',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon.svg`,
      width: 512,
      height: 512,
    },
    description:
      'Polski portal piłkarski z wynikami na żywo, terminarzem Mistrzostw Świata 2026 i statystykami piłkarskimi.',
    sameAs: [
      'https://www.instagram.com/bialoczerwon/',
    ],
    foundingDate: '2024',
    publishingPrinciples: SITE_URL,
    masthead: SITE_URL,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

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
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
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
      '@type': 'NewsMediaOrganization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Biało-Czerwoni',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
      sameAs: ['https://www.instagram.com/bialoczerwon/'],
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

// ── Task 5: SportsEvent schema for match detail pages ─────────────────────────
interface MatchJsonLdProps {
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string
  awayTeamLogo?: string
  startDate: string
  status: 'EventScheduled' | 'EventLive' | 'EventCompleted' | 'EventCancelled'
  venueName: string
  venueCity: string
  competition: string
  url: string
  locale: string
}

export function MatchJsonLd({
  homeTeam,
  awayTeam,
  homeTeamLogo,
  awayTeamLogo,
  startDate,
  status,
  venueName,
  venueCity,
  competition,
  url,
  locale,
}: MatchJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${homeTeam} vs ${awayTeam}`,
    startDate,
    eventStatus: `https://schema.org/${status}`,
    location: {
      '@type': 'Place',
      name: venueName || (locale === 'pl' ? 'Nieznany stadion' : 'Unknown venue'),
      address: venueCity || '',
    },
    homeTeam: {
      '@type': 'SportsTeam',
      name: homeTeam,
      sport: 'Football',
      ...(homeTeamLogo && { logo: homeTeamLogo }),
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: awayTeam,
      sport: 'Football',
      ...(awayTeamLogo && { logo: awayTeamLogo }),
    },
    organizer: {
      '@type': 'Organization',
      name: competition || 'FIFA World Cup 2026',
    },
    url,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Task 6: SportsTeam schema for team detail pages ───────────────────────────
interface TeamJsonLdProps {
  name: string
  logo: string
  country: string
  url: string
  gruppe?: string
}

export function TeamJsonLd({ name, logo, country, url, gruppe }: TeamJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name,
    sport: 'Football',
    logo: logo || undefined,
    url,
    ...(country && {
      memberOf: {
        '@type': 'SportsOrganization',
        name: 'FIFA World Cup 2026',
      },
      location: {
        '@type': 'Place',
        name: country,
      },
    }),
    ...(gruppe && {
      description: `FIFA World Cup 2026 – Group ${gruppe}`,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
