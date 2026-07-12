const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://bialoczerwoni.live'

/**
 * NewsMediaOrganization schema — rendered ONCE in the root layout.
 * Tells AI engines and search engines who publishes this site.
 */
export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Biało-Czerwoni | Matchday Arena',
    alternateName: 'Matchday Arena',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/icon.svg`,
      contentUrl: `${SITE_URL}/icon.svg`,
      width: 512,
      height: 512,
      caption: 'Biało-Czerwoni | Matchday Arena',
    },
    image: { '@id': `${SITE_URL}/#logo` },
    description:
      'Polski portal piłkarski z wynikami na żywo, terminarzem Mistrzostw Świata 2026 i statystykami piłkarskimi.',
    sameAs: ['https://www.instagram.com/bialoczerwon/'],
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
