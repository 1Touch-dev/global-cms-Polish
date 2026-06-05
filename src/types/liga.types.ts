export interface Liga {
  id: string
  name: string
  code: string
  land: string
  logo?: string
  saison: string
  aktuellerSpieltag: number
}

export interface LigaTabellePlatz {
  rang: number
  team: {
    id: number
    name: string
    wappen: string
  }
  spiele: number
  siege: number
  unentschieden: number
  niederlagen: number
  tore: number
  gegentore: number
  tordifferenz: number
  punkte: number
  form: ('S' | 'U' | 'N')[]
}

export interface LigaStandings {
  liga: Liga
  tabelle: LigaTabellePlatz[]
}

export type ZoneTyp = 'meisterschaft' | 'champions_league' | 'europa_league' | 'conference_league' | 'abstieg' | 'relegation'

export interface TabellenZone {
  typ: ZoneTyp
  von: number
  bis: number
  farbe: string
  label: string
}
