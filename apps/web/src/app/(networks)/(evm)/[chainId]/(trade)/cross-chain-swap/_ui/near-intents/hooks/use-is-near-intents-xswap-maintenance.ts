import { useQuery } from '@tanstack/react-query'
import ms from 'ms'

export function useIsNearIntentsXSwapMaintenance() {
  return useQuery({
    queryKey: ['near-intents-cross-chain-swap-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/near-intents-xswap', {
        next: { revalidate: 60 },
      })
      const data = await resp.json()

      if (data.success && data.data) {
        return data.data.maintenance as boolean
      }

      return false
    },
    initialData: false,
    refetchInterval: ms('60s'),
  })
}
