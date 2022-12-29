import { useQuery, useQueryClient } from '@tanstack/react-query'

interface UseExpertMode {
  account?: string
}

export const useExpertMode = ({ account }: UseExpertMode) => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, boolean>({
    initialData: false,
    queryKey: ['expertMode', { account }],
    queryFn: () => queryClient.getQueryData<boolean>(['expertMode', { account }]),
  })
}
