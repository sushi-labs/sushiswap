import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useClearNotifications = ({ account }: { account: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['notifications', { account }],
    mutationFn: async () => {
      queryClient.setQueryData(['notifications', { account }], () => {
        return {}
      })
    },
  })
}
