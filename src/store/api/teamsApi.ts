import { baseApi } from './baseApi'
import { Team, TeamDetail } from '@/types/team.types'

export const teamsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], { liga?: string; kontinent?: string }>({
      query: (params) => ({
        url: '/teams',
        params,
      }),
      providesTags: ['Teams'],
    }),
    getTeamById: builder.query<TeamDetail, number>({
      query: (id) => `/teams/${id}`,
      providesTags: (result, error, id) => [{ type: 'Teams', id }],
    }),
  }),
})

export const { useGetTeamsQuery, useGetTeamByIdQuery } = teamsApi
