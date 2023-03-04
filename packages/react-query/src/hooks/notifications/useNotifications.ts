import { NotificationData } from '@sushiswap/ui13/components/toast'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export const useNotifications = ({ account }: { account: string }) => {
  const queryClient = useQueryClient()
  return useQuery<unknown, unknown, Record<string, NotificationData[]>>({
    queryKey: ['notifications', { account }],
    queryFn: () => queryClient.getQueryData<Record<string, NotificationData[]>>(['notifications', { account }]),
  })
}
