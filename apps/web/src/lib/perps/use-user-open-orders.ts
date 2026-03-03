import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../wallet'

export const useUserOpenOrders = ({ coin }: { coin?: string }) => {
  const address = useAccount('evm')
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
  const isLoading = isLoadingOpenOrders || isAssetListLoading
  const isError = isErrorOpenOrders || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    const orders = data.orders.map((i) => {
      const asset = assetList?.get(i.coin)
      return {
        ...i,
        assetSymbol: asset?.marketType === 'perp' ? i.coin : asset?.symbol,
        marketType: asset?.marketType,
        perpsDex: asset?.dex,
        szDecimals: asset?.decimals,
      }
    })
    if (coin) {
      return orders?.filter((o) => o?.coin === coin)
    }
    return orders
  }, [data, assetList, coin])

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
