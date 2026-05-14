import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserFills } from '../subscription'
import { formatTradeHistoryItem } from '../user'

export const useVaultTradeHistory = (
  vaultAddress: EvmAddress,
  aggregateFillsByTime: boolean,
) => {
  const {
    data,
    isLoading: isLoadingFills,
    isError: isErrorFills,
  } = useUserFills({
    address: vaultAddress,
    aggregateByTime: aggregateFillsByTime,
  })
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()
  const isLoading = isLoadingFills || isAssetListLoading
  const isError = isErrorFills || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.fills?.map((fill) => {
      return formatTradeHistoryItem(fill, assetList)
    })
  }, [data, assetList])

  return useMemo(() => {
    if (!vaultAddress) {
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
  }, [isLoading, isError, formattedData, vaultAddress])
}
