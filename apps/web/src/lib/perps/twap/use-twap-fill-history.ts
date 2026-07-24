import {
  type UserTwapSliceFillsResponse,
  userTwapSliceFills,
} from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserTwapFillHistory } from '../subscription/use-use-twap-fill-history'
import { hlHttpTransport } from '../transports'

const formatTwapFillHistory = (
  twapSliceFills: UserTwapSliceFillsResponse,
  assetList: ReturnType<
    typeof useAssetListState
  >['state']['assetListQuery']['data'],
) => {
  return twapSliceFills.map((i) => {
    const asset = assetList?.get(i.fill.coin)

    return {
      ...i.fill,
      assetSymbol: asset?.marketType === 'perp' ? i.fill.coin : asset?.symbol,
      marketType: asset?.marketType,
      twapId: i.twapId,
      perpsDex: asset?.dex,
    }
  })
}

export const useTwapFillHistory = ({ isViewAll }: { isViewAll: boolean }) => {
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
  const allTwapFillHistoryQuery = useQuery({
    queryKey: ['useTwapFillHistory', 'all', address],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return await userTwapSliceFills(
        { transport: hlHttpTransport },
        { user: address },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll),
  })

  const twapSliceFills = isViewAll
    ? allTwapFillHistoryQuery.data
    : data?.twapSliceFills
  const isLoading = isViewAll
    ? allTwapFillHistoryQuery.isLoading || isAssetListLoading
    : isLoadingTwapHistory || isAssetListLoading
  const isError = isViewAll
    ? allTwapFillHistoryQuery.isError || isAssetListError
    : isErrorTwapHistory || isAssetListError

  const formattedData = useMemo(() => {
    if (!twapSliceFills) return []
    return formatTwapFillHistory(twapSliceFills, assetList)
  }, [twapSliceFills, assetList])

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
