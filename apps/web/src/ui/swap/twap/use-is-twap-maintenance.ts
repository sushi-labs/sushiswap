import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useEdgeConfig } from 'src/providers/edge-config-provider'
import type { DCAEdgeConfig, LimitEdgeConfig } from '../trade/trade-edge-config'
import { useDerivedStateTwap } from './derivedstate-twap-provider'

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
