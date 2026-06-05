'use client'

import { useTranslations } from 'next-intl'
import { Spieler } from '@/types/spieler.types'
import { Link } from '@/i18n/routing'
import { ArrowUpRight } from 'lucide-react'

interface SpielerKarteProps {
  spieler: Spieler
}

export function SpielerKarte({ spieler }: SpielerKarteProps) {
  const t = useTranslations('spieler')

  const positionFarbe: Record<string, string> = {
    Goalkeeper: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Defender: 'bg-green-500/20 text-green-400 border-green-500/30',
    Midfielder: 'bg-[var(--color-aka)]/20 text-[var(--color-aka)] border-[var(--color-aka)]/30',
    Attacker: 'bg-[var(--color-aka)]/20 text-red-400 border-[var(--color-aka)]/30',
    Torwart: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Abwehr: 'bg-green-500/20 text-green-400 border-green-500/30',
    Mittelfeld: 'bg-[var(--color-aka)]/20 text-[var(--color-aka)] border-[var(--color-aka)]/30',
    Sturm: 'bg-[var(--color-aka)]/20 text-red-400 border-[var(--color-aka)]/30',
  }

  const positionLabel: Record<string, string> = {
    Goalkeeper: t('torwart'),
    Defender: t('abwehr'),
    Midfielder: t('mittelfeld'),
    Attacker: t('sturm'),
    Torwart: t('torwart'),
    Abwehr: t('abwehr'),
    Mittelfeld: t('mittelfeld'),
    Sturm: t('sturm'),
  }

  const posColor = positionFarbe[spieler.position] || positionFarbe.Midfielder
  const posLabel = positionLabel[spieler.position] || spieler.position
  const rating = Math.min(10, (spieler.statistiken.tore * 0.8 + spieler.statistiken.vorlagen * 0.5 + spieler.statistiken.passquote * 0.03)).toFixed(1)

  return (
    <Link href={`/spieler/${spieler.id}`}>
      <div className="bg-[var(--color-grau)] rounded-xl border border-(--color-border) hover:border-[var(--color-aka)]/40 transition-all group cursor-pointer overflow-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-aka)]/3 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header with number */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {spieler.bild ? (
              <img src={spieler.bild} alt={spieler.name} className="w-12 h-12 rounded-full object-cover border border-(--color-border)" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg font-bold text-[var(--color-aka)] border border-(--color-border)">
                {spieler.trikotNummer}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="text-(--color-text-primary) font-semibold truncate group-hover:text-[var(--color-aka)] transition-colors">{spieler.name}</h3>
              <p className="text-(--color-text-muted) text-xs">{spieler.verein}</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-(--color-text-secondary) group-hover:text-[var(--color-aka)] transition-colors flex-shrink-0 mt-1" />
        </div>

        {/* Position + Nationality */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded border ${posColor}`}>
            {posLabel}
          </span>
          <span className="text-xs text-(--color-text-muted) flex items-center gap-1">
            {spieler.vereinLogo && (
              <img src={spieler.vereinLogo} alt={spieler.verein} className="w-3.5 h-3.5 object-contain" />
            )}
            {spieler.nationalitaet}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 border-t border-(--color-border)">
          <div className="p-3 text-center border-r border-(--color-border)">
            <p className="text-[var(--color-aka)] font-bold text-lg">{spieler.statistiken.tore}</p>
            <p className="text-(--color-text-muted) text-[10px] uppercase">{t('tore')}</p>
          </div>
          <div className="p-3 text-center border-r border-(--color-border)">
            <p className="text-(--color-text-primary) font-bold text-lg">{spieler.statistiken.vorlagen}</p>
            <p className="text-(--color-text-muted) text-[10px] uppercase">{t('vorlagen')}</p>
          </div>
          <div className="p-3 text-center border-r border-(--color-border)">
            <p className="text-(--color-text-primary) font-bold text-lg">{spieler.statistiken.spiele}</p>
            <p className="text-(--color-text-muted) text-[10px] uppercase">{t('spiele')}</p>
          </div>
          <div className="p-3 text-center">
            <p className={`font-bold text-lg ${Number(rating) >= 7 ? 'text-green-400' : Number(rating) >= 5 ? 'text-yellow-400' : 'text-(--color-text-muted)'}`}>{rating}</p>
            <p className="text-(--color-text-muted) text-[10px] uppercase">{t('rating')}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
