import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Reprezentacja Polski | Biało-Czerwoni',
  description: 'Aktualności o reprezentacji Polski — powołania, mecze, trener.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function ReprezentacjaPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.PolandNationalTeam, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Reprezentacja Polski"
      eyebrow="Biało-Czerwoni"
      data={data}
      basePath="/reprezentacja"
      currentPage={page}
    />
  )
}
