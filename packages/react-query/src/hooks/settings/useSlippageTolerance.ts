import { useQuery, useQueryClient } from '@tanstack/react-query'

interface UseSlippageTolerance {
  account?: string
}

export const useSlippageTolerance = ({ account }: UseSlippageTolerance) => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, boolean>({
    queryKey: ['carbonOffset', { account }],
    queryFn: () => queryClient.getQueryData<boolean>(['carbonOffset', { account }]),
  })
}
