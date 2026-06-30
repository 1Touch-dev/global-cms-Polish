import type { Metadata } from 'next'
import { fetchBialoCzerwoniArticlesByEndpoint, BC_ENDPOINTS } from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'
import { getPageMetadata } from '@/lib/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return getPageMetadata('wm', locale, '/ms-2026')
}

export const revalidate = 60

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ strona?: string }>
}

export default async function Ms2026Page({ params, searchParams }: Props) {
  const { locale } = await params
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
