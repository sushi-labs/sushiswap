import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'
import { SPOT_ASSETS_TO_REWRITE, getPerpsDexAndCoin } from '../utils'

export const useTradeHistory = () => {
  const address = useAccount('evm')
  const {
    state: {
      userFillsQuery: {
        data,
        isLoading: isLoadingFills,
        isError: isErrorFills,
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
  const isLoading = isLoadingFills || isAssetListLoading
  const isError = isErrorFills || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.fills?.map((fill) => {
      const coin = fill.coin
      const { perpsDex, coin: cleanedCoin } = getPerpsDexAndCoin(coin)
      const asset = assetList?.get(fill.coin)
      const token0Symbol =
        asset?.marketType === 'perp'
          ? asset?.symbol?.split('-')?.[0]
          : asset?.symbol?.split('/')?.[0]
      const token1Symbol =
        asset?.marketType === 'perp'
          ? asset?.symbol?.split('-')?.[1]
          : asset?.symbol?.split('/')?.[1]
      const _feeToken = SPOT_ASSETS_TO_REWRITE?.has(fill.feeToken)
        ? SPOT_ASSETS_TO_REWRITE?.get(fill.feeToken)
        : fill.feeToken

      return {
        ...fill,
        symbol: asset?.symbol,
        token0Symbol,
        token1Symbol,
        perpsDex,
        cleanedCoin,
        feeToken: _feeToken,
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

export type TradeHistoryItemType = ReturnType<
  typeof useTradeHistory
>['data'][number]
