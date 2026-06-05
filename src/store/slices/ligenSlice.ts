import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface LigenState {
  aktiveLiga: string
  saison: string
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
}

const initialState: LigenState = {
  aktiveLiga: 'bundesliga',
  saison: '2025-26',
  ladeStatus: 'idle',
}

const ligenSlice = createSlice({
  name: 'ligen',
  initialState,
  reducers: {
    setAktiveLiga: (state, action: PayloadAction<string>) => {
      state.aktiveLiga = action.payload
    },
    setSaison: (state, action: PayloadAction<string>) => {
      state.saison = action.payload
    },
  },
})

export const { setAktiveLiga, setSaison } = ligenSlice.actions
export default ligenSlice.reducer
