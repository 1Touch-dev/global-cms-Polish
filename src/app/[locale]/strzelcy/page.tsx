import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Strzelcy | Złoty But 2026 | Biało-Czerwoni',
  description: 'Klasyfikacja strzelców i wyścig po Złoty But na MŚ 2026.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function StrzelcyPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Scorers, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Strzelcy"
      eyebrow="Złoty But 2026"
      data={data}
      basePath="/strzelcy"
      currentPage={page}
    />
  )
}
