import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Spieler } from '@/types/spieler.types'

interface SpielerState {
  spieler: Spieler[]
  ausgewaehlterSpieler: Spieler | null
  filter: {
    position: string | null
    team: string | null
    nationalitaet: string | null
  }
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
}

const initialState: SpielerState = {
  spieler: [],
  ausgewaehlterSpieler: null,
  filter: { position: null, team: null, nationalitaet: null },
  ladeStatus: 'idle',
}

const spielerSlice = createSlice({
  name: 'spieler',
  initialState,
  reducers: {
    setSpieler: (state, action: PayloadAction<Spieler[]>) => {
      state.spieler = action.payload
    },
    setAusgewaehlterSpieler: (state, action: PayloadAction<Spieler | null>) => {
      state.ausgewaehlterSpieler = action.payload
    },
    setSpielerFilter: (state, action: PayloadAction<Partial<SpielerState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
  },
})

export const { setSpieler, setAusgewaehlterSpieler, setSpielerFilter } = spielerSlice.actions
export default spielerSlice.reducer
