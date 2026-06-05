import { baseApi } from './baseApi'
import { LigaStandings } from '@/types/liga.types'

export const ligenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLigaStandings: builder.query<LigaStandings, string>({
      query: (leagueId) => `/ligen/${leagueId}`,
      providesTags: (result, error, leagueId) => [{ type: 'Ligen', id: leagueId }],
    }),
  }),
})

export const { useGetLigaStandingsQuery } = ligenApi
