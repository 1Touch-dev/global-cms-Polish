import { Gruppe, KORundeSpiel } from '@/types/wm.types'

export const MOCK_GRUPPEN: Gruppe[] = [
  {
    name: 'A',
    teams: [
      { id: 1, name: 'Meksyk', kurzname: 'MEX', flagge: '🇲🇽', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 6, gegentore: 2, tordifferenz: 4, punkte: 7, form: ['S', 'S', 'U'] },
      { id: 2, name: 'Kanada', kurzname: 'CAN', flagge: '🇨🇦', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 4, gegentore: 3, tordifferenz: 1, punkte: 4, form: ['U', 'S', 'N'] },
      { id: 3, name: 'Ekwador', kurzname: 'ECU', flagge: '🇪🇨', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 3, gegentore: 5, tordifferenz: -2, punkte: 3, form: ['N', 'S', 'N'] },
      { id: 4, name: 'Boliwia', kurzname: 'BOL', flagge: '🇧🇴', spiele: 3, siege: 0, unentschieden: 2, niederlagen: 1, tore: 2, gegentore: 5, tordifferenz: -3, punkte: 2, form: ['U', 'N', 'U'] },
    ],
  },
  {
    name: 'B',
    teams: [
      { id: 5, name: 'Argentyna', kurzname: 'ARG', flagge: '🇦🇷', spiele: 3, siege: 3, unentschieden: 0, niederlagen: 0, tore: 8, gegentore: 1, tordifferenz: 7, punkte: 9, form: ['S', 'S', 'S'] },
      { id: 6, name: 'Urugwaj', kurzname: 'URU', flagge: '🇺🇾', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 5, gegentore: 3, tordifferenz: 2, punkte: 6, form: ['S', 'N', 'S'] },
      { id: 7, name: 'Chile', kurzname: 'CHI', flagge: '🇨🇱', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 3, gegentore: 5, tordifferenz: -2, punkte: 3, form: ['N', 'S', 'N'] },
      { id: 8, name: 'Peru', kurzname: 'PER', flagge: '🇵🇪', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 8, tordifferenz: -7, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'C',
    teams: [
      { id: 9, name: 'Niemcy', kurzname: 'GER', flagge: '🇩🇪', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 7, gegentore: 2, tordifferenz: 5, punkte: 7, form: ['S', 'U', 'S'] },
      { id: 10, name: 'Francja', kurzname: 'FRA', flagge: '🇫🇷', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 5, gegentore: 1, tordifferenz: 4, punkte: 7, form: ['S', 'S', 'U'] },
      { id: 11, name: 'Japonia', kurzname: 'JPN', flagge: '🇯🇵', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 3, gegentore: 4, tordifferenz: -1, punkte: 3, form: ['S', 'N', 'N'] },
      { id: 12, name: 'Nowa Zelandia', kurzname: 'NZL', flagge: '🇳🇿', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 9, tordifferenz: -8, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'D',
    teams: [
      { id: 13, name: 'Brazylia', kurzname: 'BRA', flagge: '🇧🇷', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 6, gegentore: 2, tordifferenz: 4, punkte: 7, form: ['S', 'U', 'S'] },
      { id: 14, name: 'Anglia', kurzname: 'ENG', flagge: '🏴', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 5, gegentore: 3, tordifferenz: 2, punkte: 6, form: ['S', 'S', 'N'] },
      { id: 15, name: 'Poludniowa Korea', kurzname: 'KOR', flagge: '🇰🇷', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 3, gegentore: 3, tordifferenz: 0, punkte: 4, form: ['U', 'N', 'S'] },
      { id: 16, name: 'Arabia Saudyjska', kurzname: 'KSA', flagge: '🇸🇦', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 7, tordifferenz: -6, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'E',
    teams: [
      { id: 17, name: 'Hiszpania', kurzname: 'ESP', flagge: '🇪🇸', spiele: 3, siege: 3, unentschieden: 0, niederlagen: 0, tore: 7, gegentore: 1, tordifferenz: 6, punkte: 9, form: ['S', 'S', 'S'] },
      { id: 18, name: 'Holandia', kurzname: 'NED', flagge: '🇳🇱', spiele: 3, siege: 1, unentschieden: 2, niederlagen: 0, tore: 4, gegentore: 2, tordifferenz: 2, punkte: 5, form: ['U', 'S', 'U'] },
      { id: 19, name: 'Senegal', kurzname: 'SEN', flagge: '🇸🇳', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 2, gegentore: 4, tordifferenz: -2, punkte: 3, form: ['S', 'N', 'N'] },
      { id: 20, name: 'Kostaryka', kurzname: 'CRC', flagge: '🇨🇷', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 7, tordifferenz: -6, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'F',
    teams: [
      { id: 21, name: 'Portugalia', kurzname: 'POR', flagge: '🇵🇹', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 6, gegentore: 2, tordifferenz: 4, punkte: 7, form: ['U', 'S', 'S'] },
      { id: 22, name: 'Wlochy', kurzname: 'ITA', flagge: '🇮🇹', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 4, gegentore: 2, tordifferenz: 2, punkte: 6, form: ['S', 'N', 'S'] },
      { id: 23, name: 'Kolumbia', kurzname: 'COL', flagge: '🇨🇴', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 3, gegentore: 3, tordifferenz: 0, punkte: 4, form: ['N', 'U', 'S'] },
      { id: 24, name: 'Kamerun', kurzname: 'CMR', flagge: '🇨🇲', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 2, gegentore: 8, tordifferenz: -6, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'G',
    teams: [
      { id: 25, name: 'USA', kurzname: 'USA', flagge: '🇺🇸', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 5, gegentore: 1, tordifferenz: 4, punkte: 7, form: ['S', 'U', 'S'] },
      { id: 26, name: 'Walia', kurzname: 'WAL', flagge: '🏴', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 3, gegentore: 3, tordifferenz: 0, punkte: 4, form: ['U', 'S', 'N'] },
      { id: 27, name: 'Egipt', kurzname: 'EGY', flagge: '🇪🇬', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 2, gegentore: 4, tordifferenz: -2, punkte: 3, form: ['N', 'N', 'S'] },
      { id: 28, name: 'Jamajka', kurzname: 'JAM', flagge: '🇯🇲', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 3, tordifferenz: -2, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'H',
    teams: [
      { id: 29, name: 'Chorwacja', kurzname: 'CRO', flagge: '🇭🇷', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 5, gegentore: 3, tordifferenz: 2, punkte: 6, form: ['S', 'N', 'S'] },
      { id: 30, name: 'Belgia', kurzname: 'BEL', flagge: '🇧🇪', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 4, gegentore: 2, tordifferenz: 2, punkte: 6, form: ['N', 'S', 'S'] },
      { id: 31, name: 'Maroko', kurzname: 'MAR', flagge: '🇲🇦', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 3, gegentore: 3, tordifferenz: 0, punkte: 4, form: ['S', 'U', 'N'] },
      { id: 32, name: 'Tunezja', kurzname: 'TUN', flagge: '🇹🇳', spiele: 3, siege: 0, unentschieden: 1, niederlagen: 2, tore: 2, gegentore: 6, tordifferenz: -4, punkte: 1, form: ['N', 'U', 'N'] },
    ],
  },
  {
    name: 'I',
    teams: [
      { id: 33, name: 'Dania', kurzname: 'DEN', flagge: '🇩🇰', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 5, gegentore: 1, tordifferenz: 4, punkte: 7, form: ['S', 'U', 'S'] },
      { id: 34, name: 'Serbia', kurzname: 'SRB', flagge: '🇷🇸', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 4, gegentore: 4, tordifferenz: 0, punkte: 4, form: ['U', 'S', 'N'] },
      { id: 35, name: 'Iran', kurzname: 'IRN', flagge: '🇮🇷', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 2, gegentore: 4, tordifferenz: -2, punkte: 3, form: ['N', 'S', 'N'] },
      { id: 36, name: 'Gwatemala', kurzname: 'GUA', flagge: '🇬🇹', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 3, tordifferenz: -2, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'J',
    teams: [
      { id: 37, name: 'Szwajcaria', kurzname: 'SUI', flagge: '🇨🇭', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 4, gegentore: 2, tordifferenz: 2, punkte: 6, form: ['S', 'N', 'S'] },
      { id: 38, name: 'Austria', kurzname: 'AUT', flagge: '🇦🇹', spiele: 3, siege: 1, unentschieden: 2, niederlagen: 0, tore: 3, gegentore: 2, tordifferenz: 1, punkte: 5, form: ['U', 'S', 'U'] },
      { id: 39, name: 'Ghana', kurzname: 'GHA', flagge: '🇬🇭', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 3, gegentore: 5, tordifferenz: -2, punkte: 3, form: ['N', 'S', 'N'] },
      { id: 40, name: 'Honduras', kurzname: 'HON', flagge: '🇭🇳', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 4, tordifferenz: -3, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'K',
    teams: [
      { id: 41, name: 'Nigeria', kurzname: 'NGA', flagge: '🇳🇬', spiele: 3, siege: 2, unentschieden: 0, niederlagen: 1, tore: 5, gegentore: 3, tordifferenz: 2, punkte: 6, form: ['S', 'N', 'S'] },
      { id: 42, name: 'Australia', kurzname: 'AUS', flagge: '🇦🇺', spiele: 3, siege: 1, unentschieden: 2, niederlagen: 0, tore: 4, gegentore: 3, tordifferenz: 1, punkte: 5, form: ['U', 'S', 'U'] },
      { id: 43, name: 'Turcja', kurzname: 'TUR', flagge: '🇹🇷', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 2, gegentore: 4, tordifferenz: -2, punkte: 3, form: ['S', 'N', 'N'] },
      { id: 44, name: 'Katar', kurzname: 'QAT', flagge: '🇶🇦', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 5, tordifferenz: -4, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
  {
    name: 'L',
    teams: [
      { id: 45, name: 'Ukraina', kurzname: 'UKR', flagge: '🇺🇦', spiele: 3, siege: 2, unentschieden: 1, niederlagen: 0, tore: 4, gegentore: 1, tordifferenz: 3, punkte: 7, form: ['S', 'S', 'U'] },
      { id: 46, name: 'Szwecja', kurzname: 'SWE', flagge: '🇸🇪', spiele: 3, siege: 1, unentschieden: 1, niederlagen: 1, tore: 3, gegentore: 3, tordifferenz: 0, punkte: 4, form: ['U', 'N', 'S'] },
      { id: 47, name: 'Algieria', kurzname: 'ALG', flagge: '🇩🇿', spiele: 3, siege: 1, unentschieden: 0, niederlagen: 2, tore: 2, gegentore: 4, tordifferenz: -2, punkte: 3, form: ['N', 'S', 'N'] },
      { id: 48, name: 'Indonezja', kurzname: 'IDN', flagge: '🇮🇩', spiele: 3, siege: 0, unentschieden: 0, niederlagen: 3, tore: 1, gegentore: 6, tordifferenz: -5, punkte: 0, form: ['N', 'N', 'N'] },
    ],
  },
]

export const MOCK_KO_SPIELE: KORundeSpiel[] = [
  { id: 49, runde: 'Achtelfinale', team1: 'Argentyna', team2: 'Dania', ergebnis: { team1: 2, team2: 0 }, datum: '2026-06-28', stadion: 'MetLife Stadium' },
  { id: 50, runde: 'Achtelfinale', team1: 'Niemcy', team2: 'Holandia', ergebnis: { team1: 3, team2: 1 }, datum: '2026-06-28', stadion: 'SoFi Stadium' },
  { id: 51, runde: 'Achtelfinale', team1: 'Hiszpania', team2: 'Chorwacja', ergebnis: { team1: 2, team2: 1 }, datum: '2026-06-29', stadion: 'AT&T Stadium' },
  { id: 52, runde: 'Achtelfinale', team1: 'Brazylia', team2: 'Szwajcaria', ergebnis: { team1: 1, team2: 0 }, datum: '2026-06-29', stadion: 'Hard Rock Stadium' },
  { id: 53, runde: 'Achtelfinale', team1: 'Francja', team2: 'USA', datum: '2026-06-30', stadion: 'Estadio Azteca' },
  { id: 54, runde: 'Achtelfinale', team1: 'Anglia', team2: 'Urugwaj', datum: '2026-06-30', stadion: 'Mercedes-Benz Stadium' },
  { id: 55, runde: 'Achtelfinale', team1: 'Portugalia', team2: 'Nigeria', datum: '2026-07-01', stadion: "Levi's Stadium" },
  { id: 56, runde: 'Achtelfinale', team1: 'Meksyk', team2: 'Belgia', datum: '2026-07-01', stadion: 'Estadio Azteca' },
  { id: 57, runde: 'Viertelfinale', team1: 'Argentyna', team2: 'Niemcy', datum: '2026-07-04', stadion: 'MetLife Stadium' },
  { id: 58, runde: 'Viertelfinale', team1: 'Hiszpania', team2: 'Brazylia', datum: '2026-07-04', stadion: 'SoFi Stadium' },
  { id: 59, runde: 'Viertelfinale', team1: null, team2: null, datum: '2026-07-05', stadion: 'AT&T Stadium' },
  { id: 60, runde: 'Viertelfinale', team1: null, team2: null, datum: '2026-07-05', stadion: 'Hard Rock Stadium' },
  { id: 61, runde: 'Halbfinale', team1: null, team2: null, datum: '2026-07-08', stadion: 'MetLife Stadium' },
  { id: 62, runde: 'Halbfinale', team1: null, team2: null, datum: '2026-07-09', stadion: 'SoFi Stadium' },
  { id: 63, runde: 'Finale', team1: null, team2: null, datum: '2026-07-19', stadion: 'MetLife Stadium' },
]
