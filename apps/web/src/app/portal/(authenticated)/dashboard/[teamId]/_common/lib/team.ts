import { cache } from 'react'

export type Team = Awaited<ReturnType<typeof getTeam>>

export const getTeam = cache(async (id: string) => {
  return {
    id,
    name: `Team${id}`,
  }
})
