import { getTranslations } from 'next-intl/server'
import { FaqSchema } from '@/components/schema/FaqSchema'

/**
 * Server component — fetches FAQ translations and renders the FaqSchema block.
 * Used on individual match detail pages.
 */
export async function MatchFaqSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' })

  const items = [
    { question: t('match_q1'), answer: t('match_a1') },
    { question: t('match_q2'), answer: t('match_a2') },
    { question: t('match_q3'), answer: t('match_a3') },
    { question: t('match_q4'), answer: t('match_a4') },
  ]

  return <FaqSchema items={items} heading={t('heading')} />
}
