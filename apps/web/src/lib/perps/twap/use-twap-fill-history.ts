import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserTwapFillHistory } from '../subscription/use-use-twap-fill-history'

export const useTwapFillHistory = () => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    data,
    isLoading: isLoadingTwapHistory,
    isError: isErrorTwapHistory,
  } = useUserTwapFillHistory({ address })
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: isAssetListLoading,
        isError: isAssetListError,
      },
    },
  } = useAssetListState()
  const isLoading = isLoadingTwapHistory || isAssetListLoading
  const isError = isErrorTwapHistory || isAssetListError

  const formattedData = useMemo(() => {
    if (!data) return []
    return data.twapSliceFills.map((i) => {
      const asset = assetList?.get(i.fill.coin)

      return {
        ...i.fill,
        assetSymbol: asset?.marketType === 'perp' ? i.fill.coin : asset?.symbol,
        marketType: asset?.marketType,
        twapId: i.twapId,
        perpsDex: asset?.dex,
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

export type TwapFillHistoryItemType = ReturnType<
  typeof useTwapFillHistory
>['data'][number]
