export interface WMTurnier {
  startDatum: string
  endDatum: string
  gastgeberlaender: string[]
  teams: number
  spiele: number
  stadien: number
  gruppen: Gruppe[]
}

export interface Gruppe {
  name: string
  teams: GruppenTeam[]
}

export interface GruppenTeam {
  id: number
  name: string
  kurzname: string
  flagge: string
  wappen?: string
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

export interface SpielplanFilter {
  gruppe?: string
  team?: string
  stadion?: string
  datum?: string
  runde?: string
}

export interface KORundeSpiel {
  id: number
  runde: 'Achtelfinale' | 'Viertelfinale' | 'Halbfinale' | 'Finale' | 'Spiel um Platz 3'
  team1: string | null
  team2: string | null
  ergebnis?: { team1: number; team2: number }
  datum: string
  stadion: string
}
