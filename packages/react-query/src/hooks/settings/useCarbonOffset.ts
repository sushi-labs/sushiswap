import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useCarbonOffset = () => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, boolean>({
    initialData: false,
    queryKey: ['carbonOffset'],
    queryFn: () => queryClient.getQueryData<boolean>(['carbonOffset']),
  })
}
