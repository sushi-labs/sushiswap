import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserTwapHistory } from '../subscription/use-user-twap-history'

export const useTwapHistory = () => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    data,
    isLoading: isLoadingTwapHistory,
    isError: isErrorTwapHistory,
  } = useUserTwapHistory({ address })
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
    return data.history.map((i) => {
      const asset = assetList?.get(i.state.coin)

      return {
        ...i.state,
        assetSymbol:
          asset?.marketType === 'perp' ? i.state.coin : asset?.symbol,
        marketType: asset?.marketType,
        status: i.status,
        timestamp: i.time,
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

export type TwapHistoryItemType = ReturnType<
  typeof useTwapHistory
>['data'][number]
