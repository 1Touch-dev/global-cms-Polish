export interface Team {
  id: number
  name: string
  kurzname: string
  code: string
  flagge: string
  wappen: string
  land: string
  kontinent: string
  fifaRanking: number
  trainer: string
  gruppe?: string
  stadion?: string
  stadionBild?: string
  stadionKapazitaet?: number
  gruendung?: number
  farben?: string[]
}

export interface TeamDetail extends Team {
  kader: Kaderspieler[]
  spielplan: TeamSpiel[]
  statistiken: TeamStatistiken
}

export interface Kaderspieler {
  id: number
  name: string
  position: string
  trikotNummer: number
  nationalitaet: string
}

export interface TeamSpiel {
  id: number
  datum: string
  gegner: string
  ergebnis?: string
  wettbewerb: string
}

export interface TeamStatistiken {
  tore: number
  gegentore: number
  ballbesitz: number
  schuesse: number
  passquote: number
}
