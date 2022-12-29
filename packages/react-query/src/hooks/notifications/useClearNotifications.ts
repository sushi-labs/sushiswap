import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useClearNotifications = ({ account }: { account: string }) => {
  const queryClient = useQueryClient()
  return useMutation({
    // TODO why ts error?
    // @ts-ignore
    mutationKey: ['notifications', { account }],
    mutationFn: () => {
      queryClient.setQueryData(['notifications', { account }], () => {
        return {}
      })
    },
  })
}
