import { useQuery, useQueryClient } from '@tanstack/react-query'

interface UseCarbonOffset {
  account?: string
}

export const useCarbonOffset = ({ account }: UseCarbonOffset) => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, boolean>({
    queryKey: ['carbonOffset', { account }],
    queryFn: () => queryClient.getQueryData<boolean>(['carbonOffset', { account }]),
  })
}
