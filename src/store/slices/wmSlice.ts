import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Gruppe } from '@/types/wm.types'

interface WMState {
  gruppen: Gruppe[]
  ausgewaehlteGruppe: string | null
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
  fehler: string | null
}

const initialState: WMState = {
  gruppen: [],
  ausgewaehlteGruppe: null,
  ladeStatus: 'idle',
  fehler: null,
}

const wmSlice = createSlice({
  name: 'wm',
  initialState,
  reducers: {
    setGruppen: (state, action: PayloadAction<Gruppe[]>) => {
      state.gruppen = action.payload
    },
    setAusgewaehlteGruppe: (state, action: PayloadAction<string | null>) => {
      state.ausgewaehlteGruppe = action.payload
    },
    setLadeStatus: (state, action: PayloadAction<WMState['ladeStatus']>) => {
      state.ladeStatus = action.payload
    },
  },
})

export const { setGruppen, setAusgewaehlteGruppe, setLadeStatus } = wmSlice.actions
export default wmSlice.reducer
