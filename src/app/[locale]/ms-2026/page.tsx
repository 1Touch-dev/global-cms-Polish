import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'MŚ 2026 | Biało-Czerwoni',
  description: 'Wszystkie aktualności o Mistrzostwach Świata 2026.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function Ms2026Page({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Wc2026, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Mistrzostwa Świata 2026"
      eyebrow="MŚ 2026"
      data={data}
      basePath="/ms-2026"
      currentPage={page}
    />
  )
}
