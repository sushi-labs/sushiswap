import { useQuery, useQueryClient } from '@tanstack/react-query'

interface UseSlippageTolerance {
  account?: string
}

export const useSlippageTolerance = ({ account }: UseSlippageTolerance) => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, 'AUTO' | string>({
    initialData: 'AUTO',
    queryKey: ['slippageTolerance', { account }],
    queryFn: () => queryClient.getQueryData<'AUTO' | string>(['slippageTolerance', { account }]),
  })
}
