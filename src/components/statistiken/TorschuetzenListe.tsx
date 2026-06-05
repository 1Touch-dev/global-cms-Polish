'use client'

import { Torschuetze } from '@/types/spieler.types'
import { useTranslations } from 'next-intl'

interface TorschuetzenListeProps {
  torschuetzen: Torschuetze[]
}

export function TorschuetzenListe({ torschuetzen }: TorschuetzenListeProps) {
  const t = useTranslations('spieler')

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--color-border) text-(--color-text-muted) text-xs uppercase">
            <th className="py-3 px-2 text-left w-10">#</th>
            <th className="py-3 px-2 text-left">{t('titel')}</th>
            <th className="py-3 px-2 text-left">{t('nationalitaet')}</th>
            <th className="py-3 px-2 text-left">{t('verein')}</th>
            <th className="py-3 px-2 text-center">{t('tore')}</th>
            <th className="py-3 px-2 text-center">{t('spiele')}</th>
            <th className="py-3 px-2 text-center">Min/Tor</th>
          </tr>
        </thead>
        <tbody>
          {torschuetzen.map((ts) => (
            <tr key={ts.rang} className="border-b border-(--color-border) hover:bg-white/5 transition-colors">
              <td className="py-2.5 px-2">
                <span className={`font-bold ${ts.rang <= 3 ? 'text-[var(--color-aka)]' : 'text-(--color-text-muted)'}`}>
                  {ts.rang}
                </span>
              </td>
              <td className="py-2.5 px-2 text-(--color-text-primary) font-medium">{ts.spieler.name}</td>
              <td className="py-2.5 px-2 text-(--color-text-secondary)">{ts.spieler.nationalitaet}</td>
              <td className="py-2.5 px-2 text-(--color-text-secondary)">{ts.spieler.verein}</td>
              <td className="py-2.5 px-2 text-center font-bold text-[var(--color-aka)]">{ts.tore}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{ts.spiele}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-muted)">{ts.minutenProTor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
