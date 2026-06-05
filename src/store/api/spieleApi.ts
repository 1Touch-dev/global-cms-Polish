import { baseApi } from './baseApi'
import { Spiel, SpielStatistiken, H2HVergleich } from '@/types/spiel.types'

export const spieleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpiele: builder.query<Spiel[], { team?: string; status?: string; datum?: string }>({
      query: (params) => ({
        url: '/spiele',
        params,
      }),
      providesTags: ['Spiele'],
    }),
    getSpielById: builder.query<Spiel & { statistiken?: SpielStatistiken; h2h?: H2HVergleich }, number>({
      query: (id) => `/spiele/${id}`,
      providesTags: (result, error, id) => [{ type: 'Spiele', id }],
    }),
    getLiveSpiele: builder.query<Spiel[], void>({
      query: () => '/live',
      providesTags: ['Spiele'],
    }),
  }),
})

export const { useGetSpieleQuery, useGetSpielByIdQuery, useGetLiveSpieleQuery } = spieleApi
