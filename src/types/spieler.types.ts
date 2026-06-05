export type Position = 'Torwart' | 'Abwehr' | 'Mittelfeld' | 'Sturm'

export interface Spieler {
  id: number
  name: string
  nameDE: string
  nationalitaet: string
  position: Position
  geburtsdatum: string
  groesse: number
  verein: string
  vereinLogo?: string
  trikotNummer: number
  bild?: string
  statistiken: SpielerStatistiken
}

export interface SpielerStatistiken {
  tore: number
  vorlagen: number
  spiele: number
  gelbeKarten: number
  roteKarten: number
  schuesse: number
  passquote: number
  zweikampfquote: number
}

export interface Torschuetze {
  rang: number
  spieler: Spieler
  tore: number
  spiele: number
  minutenProTor: number
}
