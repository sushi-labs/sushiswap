import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetSlippageTolerancePayload {
  value: 'AUTO' | string
}

export const useSetSlippageTolerance = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['slippageTolerance'],
    mutationFn: async ({ value }: UseSetSlippageTolerancePayload) => {
      queryClient.setQueryData<'AUTO' | string>(['slippageTolerance'], () => {
        return value
      })
    },
  })
}
