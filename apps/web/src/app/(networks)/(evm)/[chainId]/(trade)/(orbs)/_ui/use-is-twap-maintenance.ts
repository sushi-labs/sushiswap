import { Module } from '@orbs-network/spot-react'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { useEdgeConfig } from 'src/providers/edge-config-provider'
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

const useIsSpotLossMaintenance = () => {
  const { maintenance } = useEdgeConfig<LimitEdgeConfig>()

  return useQuery({
    queryKey: ['spot-loss-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/spot-loss', {
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

const useIsTakeProfitMaintenance = () => {
  const { maintenance } = useEdgeConfig<LimitEdgeConfig>()

  return useQuery({
    queryKey: ['take-profit-maintenance'],
    queryFn: async () => {
      const resp = await fetch('/api/config/take-profit', {
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

export const useIsTwapMaintenance = (module: Module) => {
  switch (module) {
    case Module.LIMIT:
      return useIsLimitMaintenance()
    case Module.STOP_LOSS:
      return useIsSpotLossMaintenance()
    case Module.TWAP:
      return useIsDCAMaintenance()
    case Module.TAKE_PROFIT:
      return useIsTakeProfitMaintenance()
  }
}
