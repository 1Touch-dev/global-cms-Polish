import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Spiel } from '@/types/spiel.types'

interface SpieleState {
  spiele: Spiel[]
  liveSpiele: Spiel[]
  ausgewaehltesSpiel: Spiel | null
  filter: {
    status: string | null
    team: string | null
    datum: string | null
  }
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
}

const initialState: SpieleState = {
  spiele: [],
  liveSpiele: [],
  ausgewaehltesSpiel: null,
  filter: { status: null, team: null, datum: null },
  ladeStatus: 'idle',
}

const spieleSlice = createSlice({
  name: 'spiele',
  initialState,
  reducers: {
    setSpiele: (state, action: PayloadAction<Spiel[]>) => {
      state.spiele = action.payload
    },
    setLiveSpiele: (state, action: PayloadAction<Spiel[]>) => {
      state.liveSpiele = action.payload
    },
    setAusgewaehltesSpiel: (state, action: PayloadAction<Spiel | null>) => {
      state.ausgewaehltesSpiel = action.payload
    },
    setSpieleFilter: (state, action: PayloadAction<Partial<SpieleState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
  },
})

export const { setSpiele, setLiveSpiele, setAusgewaehltesSpiel, setSpieleFilter } = spieleSlice.actions
export default spieleSlice.reducer
