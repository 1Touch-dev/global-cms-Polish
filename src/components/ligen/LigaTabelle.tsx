'use client'

import { useTranslations } from 'next-intl'
import { LigaTabellePlatz, TabellenZone } from '@/types/liga.types'

interface LigaTabelleProps {
  tabelle: LigaTabellePlatz[]
  zonen?: TabellenZone[]
}

const defaultZonen: TabellenZone[] = [
  { typ: 'meisterschaft', von: 1, bis: 1, farbe: 'rgba(255,204,0,0.15)', label: 'Meisterschaft' },
  { typ: 'champions_league', von: 2, bis: 4, farbe: 'rgba(0,80,200,0.15)', label: 'Champions League' },
  { typ: 'europa_league', von: 5, bis: 6, farbe: 'rgba(0,150,80,0.15)', label: 'Europa League' },
  { typ: 'abstieg', von: 16, bis: 18, farbe: 'rgba(221,0,0,0.15)', label: 'Abstieg' },
]

export function LigaTabelle({ tabelle, zonen = defaultZonen }: LigaTabelleProps) {
  const t = useTranslations('tabelle')

  const getRowBg = (rang: number): string => {
    const zone = zonen.find(z => rang >= z.von && rang <= z.bis)
    return zone ? `background-color: ${zone.farbe}` : ''
  }

  const getZoneBorder = (rang: number): string => {
    const zone = zonen.find(z => rang >= z.von && rang <= z.bis)
    if (!zone) return ''
    switch (zone.typ) {
      case 'meisterschaft': return 'border-l-2 border-l-[var(--color-aka)]'
      case 'champions_league': return 'border-l-2 border-l-blue-500'
      case 'europa_league': return 'border-l-2 border-l-green-500'
      case 'conference_league': return 'border-l-2 border-l-emerald-400'
      case 'abstieg': return 'border-l-2 border-l-[var(--color-aka)]'
      case 'relegation': return 'border-l-2 border-l-orange-500'
      default: return ''
    }
  }

  const formBadge = (result: 'S' | 'U' | 'N') => {
    const colors = {
      S: 'bg-green-500 text-(--color-text-primary)',
      U: 'bg-gray-500 text-(--color-text-primary)',
      N: 'bg-[var(--color-aka)] text-(--color-text-primary)',
    }
    return (
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${colors[result]}`}>
        {result}
      </span>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-(--color-border) text-(--color-text-muted) text-xs uppercase">
            <th className="py-3 px-2 text-left w-8">#</th>
            <th className="py-3 px-2 text-left">{t('mannschaft')}</th>
            <th className="py-3 px-2 text-center">{t('spiele')}</th>
            <th className="py-3 px-2 text-center">{t('siege')}</th>
            <th className="py-3 px-2 text-center">{t('unentschieden')}</th>
            <th className="py-3 px-2 text-center">{t('niederlagen')}</th>
            <th className="py-3 px-2 text-center">{t('tore')}</th>
            <th className="py-3 px-2 text-center">{t('tordifferenz')}</th>
            <th className="py-3 px-2 text-center font-bold">{t('punkte')}</th>
            <th className="py-3 px-2 text-center hidden md:table-cell">{t('form')}</th>
          </tr>
        </thead>
        <tbody>
          {tabelle.map((platz) => (
            <tr
              key={platz.rang}
              className={`border-b border-(--color-border) hover:bg-white/5 transition-colors ${getZoneBorder(platz.rang)}`}
              style={{ backgroundColor: getRowBg(platz.rang) ? zonen.find(z => platz.rang >= z.von && platz.rang <= z.bis)?.farbe : undefined }}
            >
              <td className="py-2.5 px-2 text-(--color-text-muted) font-medium">{platz.rang}</td>
              <td className="py-2.5 px-2">
                <div className="flex items-center gap-2">
                  {platz.team.wappen && (
                    <img src={platz.team.wappen} alt="" className="w-5 h-5" />
                  )}
                  <span className="text-(--color-text-primary) font-medium">{platz.team.name}</span>
                </div>
              </td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{platz.spiele}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{platz.siege}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{platz.unentschieden}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{platz.niederlagen}</td>
              <td className="py-2.5 px-2 text-center text-(--color-text-secondary)">{platz.tore}:{platz.gegentore}</td>
              <td className="py-2.5 px-2 text-center">
                <span className={platz.tordifferenz > 0 ? 'text-green-400' : platz.tordifferenz < 0 ? 'text-[var(--color-aka)]' : 'text-(--color-text-muted)'}>
                  {platz.tordifferenz > 0 ? '+' : ''}{platz.tordifferenz}
                </span>
              </td>
              <td className="py-2.5 px-2 text-center font-bold text-(--color-text-primary)">{platz.punkte}</td>
              <td className="py-2.5 px-2 text-center hidden md:table-cell">
                <div className="flex items-center justify-center gap-0.5">
                  {platz.form.slice(-5).map((f, i) => (
                    <span key={i}>{formBadge(f)}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Zone Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-(--color-border)">
        {zonen.map((zone) => (
          <div key={zone.typ} className="flex items-center gap-2 text-xs text-(--color-text-muted)">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: zone.farbe, border: '1px solid rgba(255,255,255,0.1)' }} />
            {zone.label}
          </div>
        ))}
      </div>
    </div>
  )
}
