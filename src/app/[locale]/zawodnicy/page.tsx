import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

export const metadata: Metadata = {
  title: 'Zawodnicy | Biało-Czerwoni',
  description: 'Profile, forma i statystyki zawodników.',
  openGraph: { locale: 'pl_PL' },
}

export const revalidate = 60

interface Props {
  searchParams: Promise<{ strona?: string }>
}

export default async function ZawodnicyPage({ searchParams }: Props) {
  const { strona } = await searchParams
  const page = Math.max(1, Number(strona) || 1)
  const data = await fetchBialoCzerwoniArticlesByEndpoint(BC_ENDPOINTS.Players, { page, limit: 20 })

  return (
    <BcSectionPage
      title="Zawodnicy"
      eyebrow="Profile i statystyki"
      data={data}
      basePath="/zawodnicy"
      currentPage={page}
    />
  )
}
