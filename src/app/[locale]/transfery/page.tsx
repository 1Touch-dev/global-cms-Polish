import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Transfery | Biało-Czerwoni',
  description: 'Najnowsze transfery polskich i światowych piłkarzy.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function TransferyPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Transfers, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Transfery"
      eyebrow="Rynek transferowy"
      data={data}
      basePath="/transfery"
      currentPage={page}
    />
  )
}
