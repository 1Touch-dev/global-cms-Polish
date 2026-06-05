import { baseApi } from './baseApi'
import { Torschuetze } from '@/types/spieler.types'

export const statistikenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTorschuetzen: builder.query<Torschuetze[], { liga?: string; limit?: number }>({
      query: (params) => ({
        url: '/torschuetzen',
        params,
      }),
      providesTags: ['Statistiken'],
    }),
    getStatistiken: builder.query<Record<string, unknown>, { liga?: string; kategorie?: string }>({
      query: (params) => ({
        url: '/statistiken',
        params,
      }),
      providesTags: ['Statistiken'],
    }),
  }),
})

export const { useGetTorschuetzenQuery, useGetStatistikenQuery } = statistikenApi
