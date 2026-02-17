import {
  type ActiveAssetDataEvent,
  activeAssetData,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useActiveAssetData = ({
  address,
  assetString,
}: { address: EvmAddress | undefined; assetString: string }) => {
  const queryClient = useQueryClient()
  const query = useQuery<ActiveAssetDataEvent>({
    queryKey: ['useActiveAssetData', address, assetString],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    if (!assetString) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await activeAssetData(
        { transport: hlWebSocketTransport },
        { user: address, coin: assetString },
        (activeAssetDataEvent) => {
          queryClient.setQueryData(
            ['useActiveAssetData', address, assetString],
            (_prevActiveAssetDataEvent: ActiveAssetDataEvent | undefined) => {
              return activeAssetDataEvent
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, address, assetString])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
