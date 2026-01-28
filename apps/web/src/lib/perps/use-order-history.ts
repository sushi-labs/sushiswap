import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'

export const useOrderHistory = () => {
  const {
    state: {
      userHistoricalOrdersQuery: {
        data,
        isLoading: isLoadingUserHistoricalOrders,
        isError,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList, isLoading: isAssetListLoading },
    },
  } = useAssetListState()
  const isLoading = isLoadingUserHistoricalOrders || isAssetListLoading

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
    return {
      data: formattedData,
      isLoading,
      isError,
    }
  }, [isLoading, isError, formattedData])
}

export type OrderHistoryItemType = ReturnType<
  typeof useOrderHistory
>['data'][number]
