import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useExpertMode = () => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, boolean>({
    initialData: false,
    queryKey: ['expertMode'],
    queryFn: () => queryClient.getQueryData<boolean>(['expertMode']),
  })
}
