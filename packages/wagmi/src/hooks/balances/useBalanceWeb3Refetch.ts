import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useBalanceWeb3Refetch = () => {
  const queryClient = useQueryClient()
  return useCallback(async () => {
    return await queryClient.refetchQueries({
      queryKey: ['useBalance'],
      type: 'active',
    })
  }, [queryClient])
}
