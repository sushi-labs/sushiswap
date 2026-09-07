import { frontendOpenOrders } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { hlHttpTransport } from '../transports'

export const useUserOpenOrders = ({
  coin,
  isViewAll = false,
}: { coin?: string; isViewAll?: boolean }) => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    state: {
      openOrdersQuery: {
        data,
        isLoading: isLoadingOpenOrders,
        isError: isErrorOpenOrders,
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
  const allOpenOrdersQuery = useQuery({
    queryKey: ['useUserOpenOrders', 'all', address],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return frontendOpenOrders(
        { transport: hlHttpTransport },
        { user: address, dex: 'ALL_DEXS' },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll && assetList),
    staleTime: 0,
  })

  const openOrders = isViewAll ? allOpenOrdersQuery.data : data?.orders
  const isLoading = isViewAll
    ? allOpenOrdersQuery.isLoading || isAssetListLoading
    : isLoadingOpenOrders || isAssetListLoading
  const isError = isViewAll
    ? allOpenOrdersQuery.isError || isAssetListError
    : isErrorOpenOrders || isAssetListError

  const formattedData = useMemo(() => {
    if (!openOrders) return []
    const orders = openOrders
      .map((i) => {
        //HL outcomes (their prediction market) has a coin name that starts with a #, which is not a valid asset in our system. We will filter these out for now.
        if (i.coin?.startsWith('#')) return undefined
        const asset = assetList?.get(i.coin)
        return {
          ...i,
          assetSymbol: asset?.marketType === 'perp' ? i.coin : asset?.symbol,
          marketType: asset?.marketType,
          perpsDex: asset?.dex,
          szDecimals: asset?.decimals,
          type: i.orderType.toLowerCase().includes('take')
            ? ('tp' as const)
            : i.orderType.toLowerCase().includes('stop')
              ? ('sl' as const)
              : i.orderType === 'Market'
                ? ('market' as const)
                : ('limit' as const),
        }
      })
      ?.filter((i) => i !== undefined)
    if (coin) {
      return orders?.filter((o) => o?.coin === coin)
    }
    return orders
  }, [openOrders, assetList, coin])

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

export type UserOpenOrdersItemType = ReturnType<
  typeof useUserOpenOrders
>['data'][number]
