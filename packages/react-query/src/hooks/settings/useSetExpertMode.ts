import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface UseSetExpertModePayload {
  value: boolean
}

export const useSetExpertMode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['expertMode'],
    mutationFn: async ({ value }: UseSetExpertModePayload) => {
      queryClient.setQueryData<boolean>(['expertMode'], () => {
        return value
      })
    },
  })
}
