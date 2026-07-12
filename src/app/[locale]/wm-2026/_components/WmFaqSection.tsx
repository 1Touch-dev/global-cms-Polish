import { getTranslations } from 'next-intl/server'
import { FaqSchema } from '@/components/schema/FaqSchema'

/**
 * Server component — fetches FAQ translations and renders the FaqSchema block.
 * Used on the WM-2026 hub page.
 */
export async function WmFaqSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'faq' })

  const items = [
    { question: t('wm_q1'), answer: t('wm_a1') },
    { question: t('wm_q2'), answer: t('wm_a2') },
    { question: t('wm_q3'), answer: t('wm_a3') },
    { question: t('wm_q4'), answer: t('wm_a4') },
    { question: t('wm_q5'), answer: t('wm_a5') },
  ]

  return <FaqSchema items={items} heading={t('heading')} />
}
