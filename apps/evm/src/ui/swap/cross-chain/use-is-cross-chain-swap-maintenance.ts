import { useQuery } from '@tanstack/react-query'
import { CrossChainSwapEdgeConfig } from 'src/lib/edge/get-cross-chain-swap-edge-config'
import { useEdgeConfig } from 'src/providers/edge-config-provider'

export const useIsCrossChainSwapMaintenance = () => {
  const { maintenance } = useEdgeConfig<CrossChainSwapEdgeConfig>()

  return useQuery({
    queryKey: ['useIsCrossChainSwapMaintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/xswap', {
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
  })
}
