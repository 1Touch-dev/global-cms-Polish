import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Vorhersage {
  spielId: number
  team1Tore: number
  team2Tore: number
  zeitstempel: string
}

interface VorhersageState {
  vorhersagen: Vorhersage[]
  punkte: number
}

const initialState: VorhersageState = {
  vorhersagen: [],
  punkte: 0,
}

const vorhersageSlice = createSlice({
  name: 'vorhersage',
  initialState,
  reducers: {
    addVorhersage: (state, action: PayloadAction<Vorhersage>) => {
      const existing = state.vorhersagen.findIndex(v => v.spielId === action.payload.spielId)
      if (existing >= 0) {
        state.vorhersagen[existing] = action.payload
      } else {
        state.vorhersagen.push(action.payload)
      }
    },
    setPunkte: (state, action: PayloadAction<number>) => {
      state.punkte = action.payload
    },
    clearVorhersagen: (state) => {
      state.vorhersagen = []
      state.punkte = 0
    },
  },
})

export const { addVorhersage, setPunkte, clearVorhersagen } = vorhersageSlice.actions
export default vorhersageSlice.reducer
