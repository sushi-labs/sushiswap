import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../wallet'

export const useOrderHistory = () => {
  const address = useAccount('evm')
  const {
    state: {
      userHistoricalOrdersQuery: {
        data,
        isLoading: isLoadingUserHistoricalOrders,
        isError: isErrorUserHistoricalOrders,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()
  const isLoading = isLoadingUserHistoricalOrders || isAssetListLoading
  const isError = isErrorUserHistoricalOrders || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.orderHistory.map((i) => {
      const asset = assetList?.get(i.order.coin)
      return {
        status: i.status,
        statusTimestamp: i.statusTimestamp,
        order: {
          ...i.order,
          assetSymbol:
            asset?.marketType === 'perp' ? i.order.coin : asset?.symbol,
          marketType: asset?.marketType,
        },
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

export type OrderHistoryItemType = ReturnType<
  typeof useOrderHistory
>['data'][number]
