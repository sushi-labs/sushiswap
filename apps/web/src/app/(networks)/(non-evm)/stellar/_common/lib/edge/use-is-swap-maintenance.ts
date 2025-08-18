import { useQuery } from '@tanstack/react-query'
import { useEdgeConfig } from '~stellar/_common/providers/edge-config-provider'
import type { SwapEdgeConfig } from './get-swap-edge-config'

export const useIsSwapMaintenance = () => {
  const { maintenance } = useEdgeConfig<SwapEdgeConfig>()

  return useQuery({
    queryKey: ['swap-maintenance-stellar'],
    queryFn: async () => {
      const resp = await fetch('/stellar/api/config/swap', {
        next: { revalidate: 60 },
      })
      const data = await resp.json()
      if (data.success && data.data) {
        return data.data.maintenance as boolean
      }

      return false
    },
    initialData: maintenance,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  })
}
