import {
  type HistoricalOrdersResponse,
  historicalOrders,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { hlHttpTransport } from '../transports'

const formatOrderHistory = (
  orderHistory: HistoricalOrdersResponse,
  assetList: ReturnType<
    typeof useAssetListState
  >['state']['assetListQuery']['data'],
) => {
  return orderHistory
    .map((i) => {
      //HL outcomes (their prediction market) has a coin name that starts with a #, which is not a valid asset in our system. We will filter these out for now.
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
}

export const useOrderHistory = ({ isViewAll }: { isViewAll: boolean }) => {
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
  const allOrderHistoryQuery = useQuery({
    queryKey: ['useOrderHistory', 'all', address],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return await historicalOrders(
        { transport: hlHttpTransport },
        { user: address },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll),
  })

  const orderHistory = isViewAll
    ? allOrderHistoryQuery.data
    : data?.orderHistory
  const isLoading = isViewAll
    ? allOrderHistoryQuery.isLoading || isAssetListLoading
    : isLoadingUserHistoricalOrders || isAssetListLoading
  const isError = isViewAll
    ? allOrderHistoryQuery.isError || isAssetListError
    : isErrorUserHistoricalOrders || isAssetListError

  const formattedData = useMemo(() => {
    if (!orderHistory) return []
    return formatOrderHistory(orderHistory, assetList)
  }, [orderHistory, assetList])

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
