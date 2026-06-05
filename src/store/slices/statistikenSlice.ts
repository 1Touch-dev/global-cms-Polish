import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface StatistikenState {
  aktiverTab: 'wm' | 'bundesliga' | 'champions_league' | 'alle'
  kategorie: string
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
}

const initialState: StatistikenState = {
  aktiverTab: 'wm',
  kategorie: 'torschuetzen',
  ladeStatus: 'idle',
}

const statistikenSlice = createSlice({
  name: 'statistiken',
  initialState,
  reducers: {
    setAktiverTab: (state, action: PayloadAction<StatistikenState['aktiverTab']>) => {
      state.aktiverTab = action.payload
    },
    setKategorie: (state, action: PayloadAction<string>) => {
      state.kategorie = action.payload
    },
  },
})

export const { setAktiverTab, setKategorie } = statistikenSlice.actions
export default statistikenSlice.reducer
