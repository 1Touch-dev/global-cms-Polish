import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Faza pucharowa MŚ 2026 | Biało-Czerwoni',
  description: 'Faza pucharowa Mistrzostw Świata 2026 — od 1/8 finału do finału.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function Ms2026FazaPucharowaPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Wc2026KnockoutStage, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Faza pucharowa MŚ 2026"
      eyebrow="Drabinka 1/8 – Finał"
      data={data}
      basePath="/ms-2026/faza-pucharowa"
      currentPage={page}
    />
  )
}
