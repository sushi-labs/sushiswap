import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetSlippageTolerancePayload {
  value: 'AUTO' | string
}

export const useSetSlippageTolerance = ({ account }: { account?: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    // TODO why ts error?
    // @ts-ignore
    mutationKey: ['slippageTolerance', { account }],
    mutationFn: ({ value }: UseSetSlippageTolerancePayload) => {
      queryClient.setQueryData<'AUTO' | string>(['slippageTolerance', { account }], () => {
        return value
      })
    },
  })
}
