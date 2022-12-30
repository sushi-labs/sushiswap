import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetCarbonOffsetPayload {
  value: boolean
}

export const useSetCarbonOffset = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['carbonOffset'],
    mutationFn: async ({ value }: UseSetCarbonOffsetPayload) => {
      queryClient.setQueryData<boolean>(['carbonOffset'], () => {
        return value
      })
    },
  })
}
