import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetCarbonOffsetPayload {
  value: boolean
}

export const useSetCarbonOffset = ({ account }: { account?: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    // TODO why ts error?
    // @ts-ignore
    mutationKey: ['carbonOffset', { account }],
    mutationFn: ({ value }: UseSetCarbonOffsetPayload) => {
      queryClient.setQueryData<boolean>(['carbonOffset', { account }], () => {
        return value
      })
    },
  })
}
