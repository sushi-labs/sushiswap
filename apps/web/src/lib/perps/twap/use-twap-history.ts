import {
  type TwapHistoryResponse,
  twapHistory,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserTwapHistory } from '../subscription/use-user-twap-history'
import { hlHttpTransport } from '../transports'

const formatTwapHistory = (
  history: TwapHistoryResponse,
  assetList: ReturnType<
    typeof useAssetListState
  >['state']['assetListQuery']['data'],
) => {
  return history.map((i) => {
    const asset = assetList?.get(i.state.coin)

    return {
      ...i.state,
      assetSymbol: asset?.marketType === 'perp' ? i.state.coin : asset?.symbol,
      marketType: asset?.marketType,
      status: i.status,
      timestamp: i.time,
      twapId: i.twapId,
      perpsDex: asset?.dex,
    }
  })
}

export const useTwapHistory = ({ isViewAll }: { isViewAll: boolean }) => {
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
  const allTwapHistoryQuery = useQuery({
    queryKey: ['useTwapHistory', 'all', address],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return await twapHistory(
        { transport: hlHttpTransport },
        { user: address },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll),
  })

  const history = isViewAll ? allTwapHistoryQuery.data : data?.history
  const isLoading = isViewAll
    ? allTwapHistoryQuery.isLoading || isAssetListLoading
    : isLoadingTwapHistory || isAssetListLoading
  const isError = isViewAll
    ? allTwapHistoryQuery.isError || isAssetListError
    : isErrorTwapHistory || isAssetListError

  const formattedData = useMemo(() => {
    if (!history) return []
    return formatTwapHistory(history, assetList)
  }, [history, assetList])

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
