import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'

export const useUserOpenOrders = () => {
  const { address } = useAccount()
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
    const dexName = data?.dex
    return data.orders.map((i) => {
      const asset = assetList?.get(i.coin)
      return {
        ...i,
        assetSymbol: asset?.marketType === 'perp' ? i.coin : asset?.symbol,
        marketType: asset?.marketType,
        perpsDex: dexName,
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

export type UserOpenOrdersItemType = ReturnType<
  typeof useUserOpenOrders
>['data'][number]
