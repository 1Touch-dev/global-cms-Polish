import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Team } from '@/types/team.types'

interface TeamState {
  teams: Team[]
  ausgewaehltesTeam: Team | null
  filter: {
    kontinent: string | null
    gruppe: string | null
  }
  ladeStatus: 'idle' | 'laden' | 'erfolg' | 'fehler'
}

const initialState: TeamState = {
  teams: [],
  ausgewaehltesTeam: null,
  filter: { kontinent: null, gruppe: null },
  ladeStatus: 'idle',
}

const teamSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload
    },
    setAusgewaehltesTeam: (state, action: PayloadAction<Team | null>) => {
      state.ausgewaehltesTeam = action.payload
    },
    setFilter: (state, action: PayloadAction<Partial<TeamState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload }
    },
  },
})

export const { setTeams, setAusgewaehltesTeam, setFilter } = teamSlice.actions
export default teamSlice.reducer
