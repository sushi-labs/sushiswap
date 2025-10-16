'use client'

import { useQuery } from '@tanstack/react-query'
import { getFeeTiers } from '../../soroban/dex-factory-helpers'

export const useFeeTiers = () => {
  return useQuery({
    queryKey: ['factory', 'feeTiers'],
    queryFn: async () => {
      return await getFeeTiers()
    },
  })
}
