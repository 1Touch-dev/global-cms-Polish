import { baseApi } from './baseApi'
import { Spieler } from '@/types/spieler.types'

export const spielerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpieler: builder.query<Spieler[], { position?: string; team?: string; nationalitaet?: string }>({
      query: (params) => ({
        url: '/spieler',
        params,
      }),
      providesTags: ['Spieler'],
    }),
    getSpielerById: builder.query<Spieler, number>({
      query: (id) => `/spieler/${id}`,
      providesTags: (result, error, id) => [{ type: 'Spieler', id }],
    }),
  }),
})

export const { useGetSpielerQuery, useGetSpielerByIdQuery } = spielerApi
