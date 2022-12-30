import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useSlippageTolerance = () => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, 'AUTO' | string>({
    initialData: 'AUTO',
    queryKey: ['slippageTolerance'],
    queryFn: () => queryClient.getQueryData<'AUTO' | string>(['slippageTolerance']),
  })
}
