import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { SwapEdgeConfig } from 'src/app/(evm)/(trade)/swap/get-swap-edge-config'
import { useEdgeConfig } from 'src/providers/edge-config-provider'

export const useIsSwapMaintenance = () => {
  const { maintenance } = useEdgeConfig<SwapEdgeConfig>()

  return useQuery({
    queryKey: ['swap-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/swap', {
        next: { revalidate: 60 },
      })
      const data = await resp.json()

      if (data.success && data.data) {
        return data.data.maintenance as boolean
      }

      return false
    },
    initialData: maintenance,
    refetchInterval: ms('1m'),
  })
}
