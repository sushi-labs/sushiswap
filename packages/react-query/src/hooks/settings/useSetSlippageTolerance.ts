import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetSlippageTolerancePayload {
  value: boolean
}

export const useSetSlippageTolerance = ({ account }: { account?: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    // TODO why ts error?
    // @ts-ignore
    mutationKey: ['carbonOffset', { account }],
    mutationFn: ({ value }: UseSetSlippageTolerancePayload) => {
      queryClient.setQueryData<boolean>(['carbonOffset', { account }], () => {
        return value
      })
    },
  })
}
