import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useEdgeConfig } from 'src/providers/edge-config-provider'
import {
  type SwapEdgeConfig,
  parseSwapEdgeConfig,
} from '~evm/[chainId]/(trade)/swap/get-swap-edge-config'

export const useIsSwapMaintenance = () => {
  const { maintenance } = useEdgeConfig<SwapEdgeConfig>()

  return useQuery({
    queryKey: ['swap-maintenance'],
    queryFn: async () => {
      try {
        const resp = await fetch('/api/config/swap', {
          next: { revalidate: 60 },
        })
        if (!resp.ok) return false
        return parseSwapEdgeConfig(await resp.json()).maintenance
      } catch {
        return false
      }
    },
    initialData: maintenance,
    refetchInterval: ms('1m'),
  })
}
