export type SpielStatus = 'Geplant' | 'Live' | 'Halbzeit' | 'Beendet' | 'Verschoben'

export interface Spiel {
  id: number
  datum: string
  uhrzeit: string
  team1: SpielTeam
  team2: SpielTeam
  ergebnis?: SpielErgebnis
  stadion: string
  stadt: string
  gruppe?: string
  runde?: string
  status: SpielStatus
  schiedsrichter?: string
  zuschauer?: number
}

export interface SpielTeam {
  id: number
  name: string
  kurzname: string
  flagge: string
  wappen?: string
}

export interface SpielErgebnis {
  team1: number
  team2: number
  halbzeit?: { team1: number; team2: number }
}

export interface SpielStatistiken {
  ballbesitz: [number, number]
  torschuesse: [number, number]
  torschuesseAufsTor: [number, number]
  ecken: [number, number]
  fouls: [number, number]
  gelbeKarten: [number, number]
  roteKarten: [number, number]
  abseits: [number, number]
  paesse: [number, number]
  passquote: [number, number]
}

export interface SpielEreignis {
  minute: number
  typ: 'Tor' | 'GelbeKarte' | 'RoteKarte' | 'Wechsel' | 'Eigentor'
  spieler: string
  team: string
  details?: string
}

export interface H2HVergleich {
  team1: string
  team2: string
  gesamtSpiele: number
  team1Siege: number
  unentschieden: number
  team2Siege: number
  letzteSpiele: LetztesBegegnung[]
  toreTeam1: number
  toreTeam2: number
}

export interface LetztesBegegnung {
  datum: string
  wettbewerb: string
  ergebnis: string
  sieger: string | null
}

export interface Aufstellung {
  formation: string
  startelf: AufstellungSpieler[]
  ersatzbank: AufstellungSpieler[]
}

export interface AufstellungSpieler {
  id: number
  name: string
  trikotNummer: number
  position: string
}
