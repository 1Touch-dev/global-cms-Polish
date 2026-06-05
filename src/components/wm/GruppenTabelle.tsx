'use client'

import { useTranslations } from 'next-intl'
import type { Gruppe } from '@/types/wm.types'

interface GruppenTabelleProps {
  gruppe: Gruppe
}

export function GruppenTabelle({ gruppe }: GruppenTabelleProps) {
  const t = useTranslations('wm')

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
        <h3 className="font-[var(--font-display)] text-xl uppercase tracking-wide text-[var(--accent)]">
          {t('gruppe')} {gruppe.name}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--text-muted)]">
              <th className="w-8 px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">{t('mannschaft')}</th>
              <th className="px-2 py-3 text-center">SP</th>
              <th className="px-2 py-3 text-center">S</th>
              <th className="px-2 py-3 text-center">U</th>
              <th className="px-2 py-3 text-center">N</th>
              <th className="px-2 py-3 text-center">{t('toreHeader')}</th>
              <th className="px-2 py-3 text-center">TD</th>
              <th className="px-2 py-3 text-center font-bold text-[var(--accent)]">{t('punkte')}</th>
            </tr>
          </thead>
          <tbody>
            {gruppe.teams.map((team, index) => {
              const isQualifying = index < 2
              return (
                <tr
                  key={team.id}
                  className={`border-b border-[var(--border)]/50 transition-colors hover:bg-[var(--surface-soft)] ${
                    isQualifying ? 'bg-[var(--accent)]/6' : ''
                  } ${index % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        isQualifying
                          ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)]'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {team.wappen ? (
                        <img src={team.wappen} alt={team.name} className="h-6 w-6 object-contain" />
                      ) : (
                        <span className="text-lg">{team.flagge}</span>
                      )}
                      <span className={`font-medium ${isQualifying ? 'text-[var(--text-main)]' : 'text-[var(--text-secondary)]'}`}>
                        {team.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-3 text-center text-[var(--text-secondary)]">{team.spiele}</td>
                  <td className="px-2 py-3 text-center text-emerald-400">{team.siege}</td>
                  <td className="px-2 py-3 text-center text-[var(--text-muted)]">{team.unentschieden}</td>
                  <td className="px-2 py-3 text-center text-rose-400">{team.niederlagen}</td>
                  <td className="px-2 py-3 text-center text-[var(--text-secondary)]">
                    {team.tore}:{team.gegentore}
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span
                      className={
                        team.tordifferenz > 0
                          ? 'text-emerald-400'
                          : team.tordifferenz < 0
                          ? 'text-rose-400'
                          : 'text-[var(--text-muted)]'
                      }
                    >
                      {team.tordifferenz > 0 ? '+' : ''}
                      {team.tordifferenz}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="text-base font-bold text-[var(--accent)]">{team.punkte}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--border)] px-4 py-2 text-xs text-[var(--text-muted)]">
        <span className="inline-block h-3 w-3 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/20" />
        {t('qualifikation')}
      </div>
    </div>
  )
}
