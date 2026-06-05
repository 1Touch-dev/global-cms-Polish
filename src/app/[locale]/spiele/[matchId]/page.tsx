'use client'

import { use, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, MapPin, Calendar, Clock, Users, Trophy, Activity } from 'lucide-react'
import { FadeInSection } from '@/components/ui/PageTransition'
import { NewsSection, getNewsCollections } from '@/components/news/NewsSection'
import type { SpielStatistiken, SpielEreignis, H2HVergleich, Aufstellung, AufstellungSpieler } from '@/types/spiel.types'

type TabId = 'uebersicht' | 'statistiken' | 'aufstellung' | 'spielverlauf' | 'kopfAnKopf'

// Static tab definitions removed â€” tabs defined inside component using translations

const matchData = {
  team1: { name: 'Deutschland', kurzname: 'GER', flagge: '/flags/de.svg' },
  team2: { name: 'Frankreich', kurzname: 'FRA', flagge: '/flags/fr.svg' },
  ergebnis: { team1: 2, team2: 1, halbzeit: { team1: 1, team2: 0 } },
  status: 'Beendet' as const,
  datum: '21. Juni 2026',
  uhrzeit: '21:00',
  stadion: 'SoFi Stadium',
  stadt: 'Los Angeles',
  gruppe: 'Gruppe C',
  schiedsrichter: 'Felix Brych',
  zuschauer: 78432,
}

const statistiken: SpielStatistiken = {
  ballbesitz: [58, 42],
  torschuesse: [14, 9],
  torschuesseAufsTor: [6, 3],
  ecken: [7, 4],
  fouls: [10, 13],
  gelbeKarten: [1, 3],
  roteKarten: [0, 0],
  abseits: [2, 3],
  paesse: [542, 398],
  passquote: [89, 82],
}

const ereignisse: SpielEreignis[] = [
  { minute: 23, typ: 'Tor', spieler: 'Jamal Musiala', team: 'Deutschland', details: 'Vorlage: Florian Wirtz' },
  { minute: 34, typ: 'GelbeKarte', spieler: 'Aurelien Tchouameni', team: 'Frankreich', details: '' },
  { minute: 55, typ: 'GelbeKarte', spieler: 'Dayot Upamecano', team: 'Frankreich', details: '' },
  { minute: 60, typ: 'Wechsel', spieler: 'Leroy Sane', team: 'Deutschland', details: 'Fuer: Serge Gnabry' },
  { minute: 67, typ: 'Tor', spieler: 'Kylian Mbappe', team: 'Frankreich', details: 'Vorlage: Antoine Griezmann' },
  { minute: 70, typ: 'Wechsel', spieler: 'Ousmane Dembele', team: 'Frankreich', details: 'Fuer: Marcus Thuram' },
  { minute: 72, typ: 'GelbeKarte', spieler: 'Eduardo Camavinga', team: 'Frankreich', details: '' },
  { minute: 78, typ: 'Tor', spieler: 'Kai Havertz', team: 'Deutschland', details: 'Vorlage: Leroy Sane' },
]

const aufstellungDeutschland: Aufstellung = {
  formation: '4-2-3-1',
  startelf: [
    { id: 1, name: 'Manuel Neuer', trikotNummer: 1, position: 'TW' },
    { id: 2, name: 'Joshua Kimmich', trikotNummer: 6, position: 'RV' },
    { id: 3, name: 'Antonio Ruediger', trikotNummer: 2, position: 'IV' },
    { id: 4, name: 'Jonathan Tah', trikotNummer: 4, position: 'IV' },
    { id: 5, name: 'David Raum', trikotNummer: 3, position: 'LV' },
    { id: 6, name: 'Robert Andrich', trikotNummer: 8, position: 'ZM' },
    { id: 7, name: 'Ilkay Guendogan', trikotNummer: 21, position: 'ZM' },
    { id: 8, name: 'Florian Wirtz', trikotNummer: 17, position: 'RA' },
    { id: 9, name: 'Jamal Musiala', trikotNummer: 10, position: 'ZOM' },
    { id: 10, name: 'Serge Gnabry', trikotNummer: 7, position: 'LA' },
    { id: 11, name: 'Kai Havertz', trikotNummer: 9, position: 'ST' },
  ],
  ersatzbank: [
    { id: 12, name: 'Marc-Andre ter Stegen', trikotNummer: 22, position: 'TW' },
    { id: 13, name: 'Nico Schlotterbeck', trikotNummer: 5, position: 'IV' },
    { id: 14, name: 'Leroy Sane', trikotNummer: 19, position: 'LA' },
    { id: 15, name: 'Leon Goretzka', trikotNummer: 18, position: 'ZM' },
    { id: 16, name: 'Thomas Mueller', trikotNummer: 13, position: 'ST' },
    { id: 17, name: 'Robin Gosens', trikotNummer: 20, position: 'LV' },
    { id: 18, name: 'Niclas Fuellkrug', trikotNummer: 11, position: 'ST' },
  ],
}

const aufstellungFrankreich: Aufstellung = {
  formation: '4-3-3',
  startelf: [
    { id: 21, name: 'Mike Maignan', trikotNummer: 1, position: 'TW' },
    { id: 22, name: 'Jules Kounde', trikotNummer: 5, position: 'RV' },
    { id: 23, name: 'Dayot Upamecano', trikotNummer: 4, position: 'IV' },
    { id: 24, name: 'William Saliba', trikotNummer: 2, position: 'IV' },
    { id: 25, name: 'Theo Hernandez', trikotNummer: 22, position: 'LV' },
    { id: 26, name: 'Aurelien Tchouameni', trikotNummer: 8, position: 'ZM' },
    { id: 27, name: 'Eduardo Camavinga', trikotNummer: 6, position: 'ZM' },
    { id: 28, name: 'Antoine Griezmann', trikotNummer: 7, position: 'ZM' },
    { id: 29, name: 'Ousmane Dembele', trikotNummer: 11, position: 'RA' },
    { id: 30, name: 'Kylian Mbappe', trikotNummer: 10, position: 'ST' },
    { id: 31, name: 'Marcus Thuram', trikotNummer: 9, position: 'LA' },
  ],
  ersatzbank: [
    { id: 32, name: 'Alphonse Areola', trikotNummer: 16, position: 'TW' },
    { id: 33, name: 'Ibrahima Konate', trikotNummer: 3, position: 'IV' },
    { id: 34, name: 'Adrien Rabiot', trikotNummer: 14, position: 'ZM' },
    { id: 35, name: 'Kingsley Coman', trikotNummer: 20, position: 'RA' },
    { id: 36, name: 'Olivier Giroud', trikotNummer: 17, position: 'ST' },
    { id: 37, name: 'Benjamin Pavard', trikotNummer: 15, position: 'RV' },
    { id: 38, name: 'Randal Kolo Muani', trikotNummer: 12, position: 'ST' },
  ],
}

const h2h: H2HVergleich = {
  team1: 'Deutschland',
  team2: 'Frankreich',
  gesamtSpiele: 34,
  team1Siege: 12,
  unentschieden: 8,
  team2Siege: 14,
  toreTeam1: 52,
  toreTeam2: 56,
  letzteSpiele: [
    { datum: '21.06.2026', wettbewerb: 'WM 2026 Gruppe C', ergebnis: '2:1', sieger: 'Deutschland' },
    { datum: '12.09.2023', wettbewerb: 'Freundschaftsspiel', ergebnis: '2:1', sieger: 'Deutschland' },
    { datum: '14.06.2022', wettbewerb: 'Nations League', ergebnis: '1:1', sieger: null },
    { datum: '15.06.2021', wettbewerb: 'EM 2020 Gruppe F', ergebnis: '0:1', sieger: 'Frankreich' },
    { datum: '06.09.2018', wettbewerb: 'Nations League', ergebnis: '0:0', sieger: null },
  ],
}

function StatBar({ label, val1, val2, suffix = '' }: { label: string; val1: number; val2: number; suffix?: string }) {
  const total = val1 + val2 || 1
  const pct1 = (val1 / total) * 100
  const pct2 = (val2 / total) * 100
  return (
    <div className="py-3">
      <div className="flex justify-between text-sm font-medium mb-1.5">
        <span className="text-[var(--gold)]">{val1}{suffix}</span>
        <span className="text-(--color-text-primary)/70 text-xs uppercase tracking-wide">{label}</span>
        <span className="text-[var(--danger)]">{val2}{suffix}</span>
      </div>
      <div className="flex h-2 rounded-full overflow-hidden bg-white/10 gap-0.5">
        <div className="h-full rounded-l-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/70 transition-all duration-700" style={{ width: `${pct1}%` }} />
        <div className="h-full rounded-r-full bg-gradient-to-l from-[var(--danger)] to-[var(--danger)]/70 transition-all duration-700" style={{ width: `${pct2}%` }} />
      </div>
    </div>
  )
}

function PlayerRow({ player }: { player: AufstellungSpieler }) {
  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
      <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold">{player.trikotNummer}</span>
      <span className="flex-1 text-sm font-medium">{player.name}</span>
      <span className="text-xs text-(--color-text-primary)/40 uppercase">{player.position}</span>
    </div>
  )
}

function TimelineEvent({ event, side }: { event: SpielEreignis; side: 'left' | 'right' }) {
  const icon = event.typ === 'Tor' ? '\u26BD' : event.typ === 'GelbeKarte' ? '\uD83D\uDFE8' : event.typ === 'RoteKarte' ? '\uD83D\uDFE5' : '\uD83D\uDD04'
  return (
    <div className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
      <div className={`flex-1 ${side === 'right' ? 'text-right' : 'text-left'}`}>
        <p className="text-sm font-semibold text-(--color-text-primary)">{event.spieler}</p>
        {event.details && <p className="text-xs text-(--color-text-primary)/50">{event.details}</p>}
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg">{icon}</span>
        <span className="text-[10px] font-bold text-[var(--gold)]">{event.minute}&apos;</span>
      </div>
    </div>
  )
}

export default function MatchPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params)
  const t = useTranslations('spiel')
  const locale = useLocale()
  const news = getNewsCollections(locale)
  const [activeTab, setActiveTab] = useState<TabId>('uebersicht')

  const TABS: { id: TabId; label: string }[] = [
    { id: 'uebersicht', label: t('uebersicht') },
    { id: 'statistiken', label: t('statistiken') },
    { id: 'aufstellung', label: t('aufstellung') },
    { id: 'spielverlauf', label: t('spielverlauf') },
    { id: 'kopfAnKopf', label: t('kopf_an_kopf') },
  ]

  return (
    <div className="min-h-screen bg-(--color-surface-1) text-(--color-text-primary)" style={{ fontFamily: 'var(--font-display)' }}>
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <Link href="/spiele" className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold)]/80 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          {t('alle_spiele')}
        </Link>
      </div>

      {/* Score Header */}
      <FadeInSection>
        <div className="w-full mt-6 bg-gradient-to-br from-[var(--bg)] via-[var(--surface-soft)] to-[var(--bg)] border border-white/10 rounded-2xl overflow-hidden">
          <div className="relative px-6 py-8 md:py-12">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)]/5 via-transparent to-[var(--danger)]/5" />
            <div className="relative max-w-5xl mx-auto">
              {/* Group Badge */}
              <div className="text-center mb-6">
                <span className="inline-block px-4 py-1.5 bg-[var(--gold)]/10 border border-[var(--gold)]/30 rounded-full text-xs font-bold text-[var(--gold)] uppercase tracking-wider">
                  {matchData.gruppe} &middot; WM 2026
                </span>
              </div>
              {/* Teams and Score */}
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Team 1 */}
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl md:text-4xl border-2 border-[var(--gold)]/30">
                    <span>&#127465;&#127466;</span>
                  </div>
                  <h2 className="text-base md:text-xl font-bold text-center">{matchData.team1.name}</h2>
                </div>
                {/* Score */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl md:text-7xl font-black tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    <span className="text-[var(--gold)]">{matchData.ergebnis.team1}</span>
                    <span className="text-(--color-text-primary)/30 mx-2">:</span>
                    <span className="text-[var(--danger)]">{matchData.ergebnis.team2}</span>
                  </div>
                  <span className="text-xs text-(--color-text-primary)/50">{t('halbzeit_stand', { score: `${matchData.ergebnis.halbzeit.team1}:${matchData.ergebnis.halbzeit.team2}` })}</span>
                  <span className="mt-1 inline-block px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-xs font-bold text-green-400">
                    {matchData.status}
                  </span>
                </div>
                {/* Team 2 */}
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl md:text-4xl border-2 border-[var(--danger)]/30">
                    <span>&#127467;&#127479;</span>
                  </div>
                  <h2 className="text-base md:text-xl font-bold text-center">{matchData.team2.name}</h2>
                </div>
              </div>
              {/* Match Meta */}
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-(--color-text-primary)/50">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{matchData.datum}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{matchData.uhrzeit} Uhr</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{matchData.stadion}, {matchData.stadt}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{matchData.zuschauer?.toLocaleString('de-DE')} Zuschauer</span>
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" />{matchData.schiedsrichter}</span>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 pb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)] border-b-2 border-[var(--gold)]'
                  : 'text-(--color-text-primary)/60 hover:text-(--color-text-primary) hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'uebersicht' && (
          <FadeInSection>
            <div className="bg-[var(--surface)] rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-[var(--gold)] mb-4 flex items-center gap-2"><Trophy className="w-5 h-5" /> {t('wichtige_ereignisse')}</h3>
              <div className="space-y-3">
                {ereignisse.map((e, i) => {
                  const icon = e.typ === 'Tor' ? '\u26BD' : e.typ === 'GelbeKarte' ? '\uD83D\uDFE8' : e.typ === 'RoteKarte' ? '\uD83D\uDFE5' : '\uD83D\uDD04'
                  return (
                    <div key={i} className="flex items-center gap-4 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-lg">{icon}</span>
                      <span className="text-xs font-bold text-[var(--gold)] w-8">{e.minute}&apos;</span>
                      <div className="flex-1">
                        <span className="text-sm font-semibold">{e.spieler}</span>
                        {e.details && <span className="text-xs text-(--color-text-primary)/50 ml-2">({e.details})</span>}
                      </div>
                      <span className="text-xs text-(--color-text-primary)/40">{e.team}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeInSection>
        )}

        {activeTab === 'statistiken' && (
          <FadeInSection>
            <div className="bg-[var(--surface)] rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-[var(--gold)]">{matchData.team1.name}</span>
                <h3 className="text-lg font-bold text-(--color-text-primary)">{t('statistiken')}</h3>                <span className="font-bold text-[var(--danger)]">{matchData.team2.name}</span>
              </div>
              <div className="space-y-1">
                <StatBar label={t('ballbesitz')} val1={statistiken.ballbesitz[0]} val2={statistiken.ballbesitz[1]} suffix="%" />
                <StatBar label={t('torschuesse')} val1={statistiken.torschuesse[0]} val2={statistiken.torschuesse[1]} />
                <StatBar label={t('aufsTor')} val1={statistiken.torschuesseAufsTor[0]} val2={statistiken.torschuesseAufsTor[1]} />
                <StatBar label={t('ecken')} val1={statistiken.ecken[0]} val2={statistiken.ecken[1]} />
                <StatBar label={t('fouls')} val1={statistiken.fouls[0]} val2={statistiken.fouls[1]} />
                <StatBar label={t('gelbeKarten')} val1={statistiken.gelbeKarten[0]} val2={statistiken.gelbeKarten[1]} />
                <StatBar label={t('roteKarten')} val1={statistiken.roteKarten[0]} val2={statistiken.roteKarten[1]} />
                <StatBar label={t('abseits')} val1={statistiken.abseits[0]} val2={statistiken.abseits[1]} />
                <StatBar label={t('paesse')} val1={statistiken.paesse[0]} val2={statistiken.paesse[1]} />
                <StatBar label={t('passquote')} val1={statistiken.passquote[0]} val2={statistiken.passquote[1]} suffix="%" />
              </div>
            </div>
          </FadeInSection>
        )}

        {activeTab === 'aufstellung' && (
          <FadeInSection>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Deutschland */}
              <div className="bg-[var(--surface)] rounded-xl border border-[var(--gold)]/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[var(--gold)]">{matchData.team1.name}</h4>
                  <span className="text-xs bg-[var(--gold)]/10 px-3 py-1 rounded-full text-[var(--gold)] font-bold">{aufstellungDeutschland.formation}</span>
                </div>
                <p className="text-xs text-(--color-text-primary)/40 uppercase tracking-wide mb-2">{t('startelf')}</p>
                <div className="space-y-0.5">
                  {aufstellungDeutschland.startelf.map(p => <PlayerRow key={p.id} player={p} />)}
                </div>
                <p className="text-xs text-(--color-text-primary)/40 uppercase tracking-wide mt-4 mb-2">{t('ersatzbank')}</p>
                <div className="space-y-0.5">
                  {aufstellungDeutschland.ersatzbank.map(p => <PlayerRow key={p.id} player={p} />)}
                </div>
              </div>
              {/* Frankreich */}
              <div className="bg-[var(--surface)] rounded-xl border border-[var(--danger)]/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-[var(--danger)]">{matchData.team2.name}</h4>
                  <span className="text-xs bg-[var(--danger)]/10 px-3 py-1 rounded-full text-[var(--danger)] font-bold">{aufstellungFrankreich.formation}</span>
                </div>
                <p className="text-xs text-(--color-text-primary)/40 uppercase tracking-wide mb-2">{t('startelf')}</p>
                <div className="space-y-0.5">
                  {aufstellungFrankreich.startelf.map(p => <PlayerRow key={p.id} player={p} />)}
                </div>
                <p className="text-xs text-(--color-text-primary)/40 uppercase tracking-wide mt-4 mb-2">{t('ersatzbank')}</p>
                <div className="space-y-0.5">
                  {aufstellungFrankreich.ersatzbank.map(p => <PlayerRow key={p.id} player={p} />)}
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {activeTab === 'spielverlauf' && (
          <FadeInSection>
            <div className="bg-[var(--surface)] rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-(--color-text-primary) mb-6 text-center">{t('spielverlauf')}</h3>
              <div className="relative max-w-2xl mx-auto">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
                <div className="space-y-6">
                  {ereignisse.sort((a, b) => a.minute - b.minute).map((event, i) => {
                    const side = event.team === 'Deutschland' ? 'left' : 'right'
                    return (
                      <div key={i} className={`grid grid-cols-[1fr_40px_1fr] items-center gap-2`}>
                        <div className={side === 'left' ? '' : 'col-start-3'}>
                          {side === 'left' && <TimelineEvent event={event} side="left" />}
                        </div>
                        <div className="flex justify-center col-start-2 row-start-1">
                          <div className="w-3 h-3 rounded-full bg-[var(--gold)] border-2 border-(--color-border)" />
                        </div>
                        <div className={side === 'right' ? 'col-start-3' : 'col-start-1'}>
                          {side === 'right' && <TimelineEvent event={event} side="right" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </FadeInSection>
        )}

        {activeTab === 'kopfAnKopf' && (
          <FadeInSection>
            <div className="bg-[var(--surface)] rounded-xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-(--color-text-primary) mb-6 text-center">{t('kopf_an_kopf')}</h3>
              {/* Win Distribution */}
              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-[var(--gold)]">{h2h.team1Siege} Siege</span>
                  <span className="text-(--color-text-primary)/50">{h2h.unentschieden} {t('unentschieden')}</span>
                  <span className="text-[var(--danger)]">{h2h.team2Siege} Siege</span>
                </div>
                <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                  <div className="bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/80 rounded-l-full" style={{ width: `${(h2h.team1Siege / h2h.gesamtSpiele) * 100}%` }} />
                  <div className="bg-white/20" style={{ width: `${(h2h.unentschieden / h2h.gesamtSpiele) * 100}%` }} />
                  <div className="bg-gradient-to-l from-[var(--danger)] to-[var(--danger)]/80 rounded-r-full" style={{ width: `${(h2h.team2Siege / h2h.gesamtSpiele) * 100}%` }} />
                </div>
                <p className="text-center text-xs text-(--color-text-primary)/40 mt-2">{h2h.gesamtSpiele} Begegnungen insgesamt &middot; Tore: {h2h.toreTeam1}:{h2h.toreTeam2}</p>
              </div>
              {/* Last 5 Meetings */}
              <h4 className="text-sm font-bold text-(--color-text-primary)/70 mb-3 uppercase tracking-wide">{t('letzteBegegnungen')}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-(--color-text-primary)/40 border-b border-white/10">
                      <th className="text-left py-2 font-medium">{t('datum')}</th>
                      <th className="text-left py-2 font-medium">{t('wettbewerb')}</th>
                      <th className="text-center py-2 font-medium">{t('ergebnis')}</th>
                      <th className="text-right py-2 font-medium">{t('sieger')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h2h.letzteSpiele.map((spiel, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 text-(--color-text-primary)/60">{spiel.datum}</td>
                        <td className="py-2.5 text-(--color-text-primary)/80">{spiel.wettbewerb}</td>
                        <td className="py-2.5 text-center font-bold">{spiel.ergebnis}</td>
                        <td className="py-2.5 text-right">
                          {spiel.sieger ? (
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${spiel.sieger === 'Deutschland' ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-[var(--danger)]/20 text-[var(--danger)]'}`}>
                              {spiel.sieger}
                            </span>
                          ) : (
                            <span className="text-xs text-(--color-text-primary)/40">{t('unentschieden')}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Biggest Wins */}
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-lg p-4">
                  <p className="text-xs text-(--color-text-primary)/40 mb-1">{t('hoechster_sieg')} â€” {matchData.team1.name}</p>
                  <p className="text-lg font-bold text-[var(--gold)]">4:1</p>
                  <p className="text-xs text-(--color-text-primary)/50">WM 2014 Viertelfinale</p>
                </div>
                <div className="bg-[var(--danger)]/5 border border-[var(--danger)]/20 rounded-lg p-4">
                  <p className="text-xs text-(--color-text-primary)/40 mb-1">{t('hoechster_sieg')} â€” {matchData.team2.name}</p>
                  <p className="text-lg font-bold text-[var(--danger)]">3:0</p>
                  <p className="text-xs text-(--color-text-primary)/50">Nations League 2018</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        )}
      </div>

      {/* Match Info Footer */}
      <FadeInSection>
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <div className="bg-[var(--surface)] rounded-xl border border-white/10 p-6 mt-8">
            <h4 className="text-sm font-bold text-(--color-text-primary)/70 mb-4 uppercase tracking-wide">{t('spielinformationen')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-(--color-text-primary)/40 mb-1">{t('schiedsrichter')}</p>
                <p className="text-sm font-semibold">{matchData.schiedsrichter}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-(--color-text-primary)/40 mb-1">{t('stadionkapazitaet')}</p>
                <p className="text-sm font-semibold">70.240 Plaetze</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-(--color-text-primary)/40 mb-1">{t('wetter')}</p>
                <p className="text-sm font-semibold">22&deg;C, klar</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-xs text-(--color-text-primary)/40 mb-1">TV-Uebertragung</p>
                <p className="text-sm font-semibold">ZDF, MagentaTV</p>
              </div>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* Related News */}
      <div className="mt-6">
        <NewsSection titel="SPIEL-NEWS" news={news.wm} maxArtikel={3} kompakt />
      </div>
    </div>
  )
}

