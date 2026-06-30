import { useTranslations, useLocale } from 'next-intl'
import AffiliateOfferCard from '@/components/affiliates/AffiliateOfferCard'
import { Link } from '@/i18n/routing'
import { Trophy, Mail, ShieldCheck } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')
  const locale = useLocale()

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,black)]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <AffiliateOfferCard locale={locale} compact className="mb-10" />
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)]">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl text-[var(--text-main)]">Matchday Arena</p>
                <p className="text-sm text-[var(--text-muted)]">Polska redakcja turniejowa</p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--text-muted)]">
              {t('beschreibung')}
            </p>
            <div className="flex items-center gap-3">
              <span className="badge-gold">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t('safe')}
              </span>
              <span className="badge-gold">
                <Mail className="h-3.5 w-3.5" />
                {t('contact')}
              </span>
            </div>
            <div className="flex gap-4 mt-5">
              <a href="https://www.instagram.com/bialoczerwon/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-base text-[var(--text-main)]">{t('links')}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><Link href="/wm-2026" className="transition hover:text-[var(--accent)]">{nav('wm2026')}</Link></li>
              <li><Link href="/teams" className="transition hover:text-[var(--accent)]">{nav('teams')}</Link></li>
              <li><Link href="/torschuetzen" className="transition hover:text-[var(--accent)]">{nav('torschuetzen')}</Link></li>
              <li><Link href="/stadien" className="transition hover:text-[var(--accent)]">{nav('stadien')}</Link></li>
              <li><Link href="/vorhersage" className="transition hover:text-[var(--accent)]">{nav('vorhersage')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-base text-[var(--text-main)]">{t('kontakt')}</h4>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li><span className="transition hover:text-[var(--accent)]">{t('datenschutz')}</span></li>
              <li><span className="transition hover:text-[var(--accent)]">{t('impressum')}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--text-muted)]">
          {t('copyright')}
        </div>
      </div>
    </footer>
  )
}
