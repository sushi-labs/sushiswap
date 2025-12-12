import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useEdgeConfig } from 'src/providers/edge-config-provider'
import { useDerivedStateTwap } from '~evm/[chainId]/(trade)/(orbs)/_ui/derivedstate-twap-provider'
import type { DCAEdgeConfig } from '~evm/[chainId]/(trade)/(orbs)/dca/get-dca-edge-config'
import type { LimitEdgeConfig } from '~evm/[chainId]/(trade)/(orbs)/limit/get-limit-edge-config'

const useIsDCAMaintenance = () => {
  const { maintenance } = useEdgeConfig<DCAEdgeConfig>()

  return useQuery({
    queryKey: ['dca-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/dca', {
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

const useIsLimitMaintenance = () => {
  const { maintenance } = useEdgeConfig<LimitEdgeConfig>()

  return useQuery({
    queryKey: ['limit-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/limit', {
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

export const useIsTwapMaintenance = () => {
  const {
    state: { isLimitOrder },
  } = useDerivedStateTwap()

  return isLimitOrder ? useIsLimitMaintenance() : useIsDCAMaintenance()
}
