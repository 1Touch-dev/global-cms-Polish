import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Inne | Biało-Czerwoni',
  description: 'VAR, przepisy, sędziowie i inne aktualności piłkarskie.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function InnePage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Other, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Inne"
      eyebrow="VAR, przepisy, różne"
      data={data}
      basePath="/inne"
      currentPage={page}
    />
  )
}
