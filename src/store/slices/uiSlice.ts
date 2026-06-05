import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sprache: 'pl' | 'en'
  thema: 'dunkel' | 'hell'
  liveTickerAktiv: boolean
  filterOffenSpiele: boolean
  suchbegriff: string
  aktivesModal: string | null
  mobileMenuOpen: boolean
}

const initialState: UIState = {
  sprache: 'pl',
  thema: 'dunkel',
  liveTickerAktiv: true,
  filterOffenSpiele: false,
  suchbegriff: '',
  aktivesModal: null,
  mobileMenuOpen: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSprache: (state, action: PayloadAction<'pl' | 'en'>) => {
      state.sprache = action.payload
    },
    setThema: (state, action: PayloadAction<'dunkel' | 'hell'>) => {
      state.thema = action.payload
    },
    toggleLiveTicker: (state) => {
      state.liveTickerAktiv = !state.liveTickerAktiv
    },
    setSuchbegriff: (state, action: PayloadAction<string>) => {
      state.suchbegriff = action.payload
    },
    setAktivesModal: (state, action: PayloadAction<string | null>) => {
      state.aktivesModal = action.payload
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
  },
})

export const {
  setSprache,
  setThema,
  toggleLiveTicker,
  setSuchbegriff,
  setAktivesModal,
  toggleMobileMenu,
} = uiSlice.actions
export default uiSlice.reducer
