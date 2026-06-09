import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Stadiony MŚ 2026 | Biało-Czerwoni',
  description: 'Profile i informacje o stadionach Mistrzostw Świata 2026.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function StadionyPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Stadiums, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Stadiony"
      eyebrow="Areny turnieju"
      data={data}
      basePath="/stadiony"
      currentPage={page}
    />
  )
}
