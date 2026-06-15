import {
  BC_ENDPOINTS,
  type BcEndpointName,
  fetchBialoCzerwoniArticlesByEndpoint,
  fetchBialoCzerwoniNewsPage,
} from '@/lib/bialoCzerwoniApi'
import { BcSectionPage } from '@/components/cms/BcSectionPage'

const NEWS_FILTERS: { label: string; value: '' | BcEndpointName }[] = [
  { label: 'Wszystkie', value: '' },
  { label: 'MŚ 2026', value: BC_ENDPOINTS.Wc2026 },
  { label: 'Reprezentacja', value: BC_ENDPOINTS.PolandNationalTeam },
  { label: 'Transfery', value: BC_ENDPOINTS.Transfers },
  { label: 'Zawodnicy', value: BC_ENDPOINTS.Players },
  { label: 'Stadiony', value: BC_ENDPOINTS.Stadiums },
  { label: 'Strzelcy', value: BC_ENDPOINTS.Scorers },
  { label: 'Inne', value: BC_ENDPOINTS.Other },
]

export default async function NewsPage({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ strona?: string; szukaj?: string; sekcja?: string }>
}) {
  const { locale } = await routeParams
  const queryParams = (await searchParams) || {}
  const currentPage = Number(queryParams.strona || '1') || 1
  const searchQuery = queryParams.szukaj?.trim() || ''
  const selectedFilter = NEWS_FILTERS.find((filter) => filter.value === queryParams.sekcja)?.value || ''
  const data = selectedFilter
    ? await fetchBialoCzerwoniArticlesByEndpoint(selectedFilter, {
      page: currentPage,
      limit: 12,
      search: searchQuery,
      locale,
    })
    : await fetchBialoCzerwoniNewsPage(currentPage, 12, { search: searchQuery, locale })

  return (
    <BcSectionPage
      title="Aktualności"
      eyebrow="CMS Newsroom"
      data={data}
      basePath="/news"
      currentPage={currentPage}
      showSearch
      searchQuery={searchQuery}
      selectedFilter={selectedFilter}
      filters={NEWS_FILTERS}
      locale={locale}
    />
  )
}
