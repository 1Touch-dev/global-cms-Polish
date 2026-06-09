import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Terminarz MŚ 2026 | Biało-Czerwoni',
  description: 'Terminarz meczów Mistrzostw Świata 2026 — daty, godziny, stadiony.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function Ms2026TerminarzPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Wc2026Schedule, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Terminarz MŚ 2026"
      eyebrow="Daty i godziny meczów"
      data={data}
      basePath="/ms-2026/terminarz"
      currentPage={page}
    />
  )
}
