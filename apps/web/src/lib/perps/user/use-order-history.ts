import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'

export const useOrderHistory = () => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
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
    return data.orderHistory
      .map((i) => {
        //HL outcomes (their prediection market) has a coin name that starts with a #, which is not a valid asset in our system. We will filter these out for now.
        if (i.order.coin?.startsWith('#')) return undefined
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
      ?.filter((i) => i !== undefined)
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
