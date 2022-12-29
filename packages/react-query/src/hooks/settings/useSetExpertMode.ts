import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetExpertModePayload {
  value: boolean
}

export const useSetExpertMode = ({ account }: { account?: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    // TODO why ts error?
    // @ts-ignore
    mutationKey: ['expertMode', { account }],
    mutationFn: ({ value }: UseSetExpertModePayload) => {
      queryClient.setQueryData<boolean>(['expertMode', { account }], () => {
        return value
      })
    },
  })
}
