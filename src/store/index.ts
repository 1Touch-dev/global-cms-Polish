import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import wmReducer from './slices/wmSlice'
import teamReducer from './slices/teamSlice'
import spielerReducer from './slices/spielerSlice'
import spieleReducer from './slices/spieleSlice'
import statistikenReducer from './slices/statistikenSlice'
import ligenReducer from './slices/ligenSlice'
import uiReducer from './slices/uiSlice'
import vorhersageReducer from './slices/vorhersageSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      wm: wmReducer,
      teams: teamReducer,
      spieler: spielerReducer,
      spiele: spieleReducer,
      statistiken: statistikenReducer,
      ligen: ligenReducer,
      ui: uiReducer,
      vorhersage: vorhersageReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
