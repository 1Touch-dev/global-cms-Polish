import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import AffiliateOffersPage from '@/components/affiliates/AffiliateOffersPage'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titleByLocale: Record<string, string> = {
    nl: '1xBet Aanbiedingen | Oranje Total Football',
    ja: '1xBet オファー | World Cup 2026',
    'pt-BR': 'Ofertas 1xBet | Futebol 2026',
    pl: 'Oferty 1xBet | Matchday Arena',
  }

  return {
    title: titleByLocale[locale] ?? '1xBet Offers',
    description: 'Sponsored football offers page powered by 1xBet.',
  }
}

export default async function BettingOffersPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AffiliateOffersPage locale={locale} />
}
