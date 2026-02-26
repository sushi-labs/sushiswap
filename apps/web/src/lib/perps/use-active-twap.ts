import { format } from 'date-fns'
import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { useAccount } from '../wallet'
import { useUserActiveTwap } from './subscription/use-user-active-twap'

export const useActiveTwap = () => {
  const address = useAccount('evm')
  const {
    data,
    isLoading: isLoadingActiveTwap,
    isError: isErrorActiveTwap,
  } = useUserActiveTwap({ address })
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()
  const isLoading = isLoadingActiveTwap || isAssetListLoading
  const isError = isErrorActiveTwap || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.states.flatMap(([twapId, state]) => {
      const asset = assetList?.get(state.coin)
      const averagePrice =
        Number.parseFloat(state.executedNtl) *
        Number.parseFloat(state.executedSz)
      const creationTime = state.timestamp
      const currentTime = Date.now()
      const runningTimeInMs = currentTime - creationTime
      const formattedRunningTime = format(runningTimeInMs, 'HH:mm:ss')
      return {
        ...state,
        twapId,
        assetSymbol: asset?.marketType === 'perp' ? state.coin : asset?.symbol,
        marketType: asset?.marketType,
        perpsDex: data.dex,
        averagePrice,
        runningTimeInMs,
        formattedRunningTime,
      }
    })
  }, [data, assetList])

  return useMemo(() => {
    if (!address) {
      return {
        data: [],
        isLoading: false,
        isError: false,
      }
    }
    return {
      data: formattedData,
      isLoading,
      isError,
    }
  }, [isLoading, isError, formattedData, address])
}

export type ActiveTwapItemType = ReturnType<
  typeof useActiveTwap
>['data'][number]
