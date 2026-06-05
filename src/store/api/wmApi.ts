import { baseApi } from './baseApi'
import { Gruppe, SpielplanFilter } from '@/types/wm.types'
import { Spiel } from '@/types/spiel.types'

export const wmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGruppen: builder.query<Gruppe[], void>({
      query: () => '/wm/gruppen',
      providesTags: ['WM'],
    }),
    getSpielplan: builder.query<Spiel[], SpielplanFilter>({
      query: (filter) => ({
        url: '/wm/spiele',
        params: filter,
      }),
      providesTags: ['Spiele'],
    }),
    getErgebnisse: builder.query<Spiel[], void>({
      query: () => '/wm/ergebnisse',
      providesTags: ['Spiele'],
    }),
    getBracket: builder.query<Spiel[], void>({
      query: () => '/wm/bracket',
      providesTags: ['WM'],
    }),
  }),
})

export const {
  useGetGruppenQuery,
  useGetSpielplanQuery,
  useGetErgebnisseQuery,
  useGetBracketQuery,
} = wmApi
