import AffiliateBannerFrame from './AffiliateBannerFrame'
import AffiliateOfferCard from './AffiliateOfferCard'
import { getAffiliateCopy } from './AffiliateConfig'

interface AffiliateOffersPageProps {
  locale: string
}

export default function AffiliateOffersPage({ locale }: AffiliateOffersPageProps) {
  const copy = getAffiliateCopy(locale)

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">{copy.label}</span>
        <h1 className="mt-3 text-3xl font-black text-[var(--text-main)] sm:text-4xl">{copy.offersHeading}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]">{copy.offersSubheading}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto]">
        <div className="space-y-8">
          <AffiliateBannerFrame locale={locale} />
          <AffiliateBannerFrame locale={locale} variant="horizontalWide" />
          <AffiliateOfferCard locale={locale} />
        </div>
        <div className="hidden lg:block">
          <AffiliateBannerFrame locale={locale} variant="verticalPrimary" />
        </div>
      </div>

      <div className="mt-8 border border-[var(--border)] bg-[var(--accent)]/10 p-4 text-xs leading-relaxed text-[var(--text-muted)]">
        {copy.terms}
      </div>
    </main>
  )
}
