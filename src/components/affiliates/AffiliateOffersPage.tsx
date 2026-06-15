import { ExternalLink, ShieldCheck, Trophy } from 'lucide-react'

const copyByLocale: Record<string, { title: string; subtitle: string; cta: string; partner: string; body: string }> = {
  pl: {
    title: 'Oferty 1xBet',
    subtitle: 'Sponsorowane oferty piłkarskie dla kibiców Biało-Czerwonych.',
    cta: 'Zobacz ofertę',
    partner: 'Partner sponsorowany',
    body: 'Ta strona zachowuje lokalną trasę ofert i jest gotowa na treści afiliacyjne zarządzane dla polskiej wersji serwisu.',
  },
  en: {
    title: '1xBet Offers',
    subtitle: 'Sponsored football offers for World Cup 2026 and global football.',
    cta: 'View offer',
    partner: 'Sponsored partner',
    body: 'This page keeps the local offers route available for affiliate content managed for this website.',
  },
}

export default function AffiliateOffersPage({ locale }: { locale: string }) {
  const copy = copyByLocale[locale] ?? copyByLocale.pl

  return (
    <main className="min-h-screen bg-navy px-4 py-12 text-white">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-gold/20 bg-navy-light p-8 shadow-2xl shadow-black/20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/15 text-gold">
            <Trophy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">{copy.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-silver/70">{copy.subtitle}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/10 bg-navy p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gold">
            <ShieldCheck className="h-4 w-4" />
            {copy.partner}
          </div>
          <p className="mb-6 max-w-3xl text-sm leading-6 text-silver/70">{copy.body}</p>
          <a
            href="https://1xbet.com"
            target="_blank"
            rel="nofollow sponsored noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-black text-navy transition-opacity hover:opacity-90"
          >
            {copy.cta}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  )
}
