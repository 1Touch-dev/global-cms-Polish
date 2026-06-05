import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Trophy, Mail, ShieldCheck } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const nav = useTranslations('nav')

  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,black)]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
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
