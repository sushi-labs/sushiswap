import {
  type UserFundingResponse,
  userFunding,
} from '@nktkas/hyperliquid/api/info'
import type { UserFundingsEvent } from '@nktkas/hyperliquid/api/subscription'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { hlHttpTransport } from '../transports'

type FundingHistory = UserFundingsEvent['fundings']

const formatFundingHistory = (
  fundings: FundingHistory,
  assetList: ReturnType<
    typeof useAssetListState
  >['state']['assetListQuery']['data'],
  isSnapshot = false,
) => {
  return fundings?.map((i) => {
    const side =
      Number.parseFloat(i.szi) > 0 ? ('long' as const) : ('short' as const)
    const asset = assetList?.get(i.coin)
    return {
      timestamp: i.time,
      coin: i.coin,
      assetSymbol: asset?.marketType === 'perp' ? i.coin : asset?.symbol,
      marketType: asset?.marketType,
      size: Math.abs(Number.parseFloat(i.szi)),
      side,
      payment: i.usdc,
      rate: i.fundingRate,
      nSamples: i.nSamples,
      isSnapshot,
    }
  })
}

const formatAllFundingHistory = (
  fundings: UserFundingResponse,
): FundingHistory => {
  return fundings.map((i) => ({
    time: i.time,
    coin: i.delta.coin,
    usdc: i.delta.usdc,
    szi: i.delta.szi,
    fundingRate: i.delta.fundingRate,
    nSamples: i.delta.nSamples,
  }))
}

export const useFundingHistory = ({
  isViewAll,
  enabled = true,
}: {
  isViewAll: boolean
  enabled?: boolean
}) => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    state: {
      userFundingsQuery: {
        data,
        isLoading: isUserFundingsLoading,
        isError: isUserFundingsError,
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
  const allFundingHistoryQuery = useQuery({
    queryKey: ['useFundingHistory', 'all', address],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return await userFunding(
        { transport: hlHttpTransport },
        { user: address },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll && enabled),
  })

  const fundingHistory = useMemo(() => {
    if (isViewAll) {
      return allFundingHistoryQuery.data
        ? formatAllFundingHistory(allFundingHistoryQuery.data)
        : undefined
    }

    return data?.fundings
  }, [allFundingHistoryQuery.data, data?.fundings, isViewAll])
  const isLoading = isViewAll
    ? allFundingHistoryQuery.isLoading || isAssetListLoading
    : isUserFundingsLoading || isAssetListLoading
  const isError = isViewAll
    ? allFundingHistoryQuery.isError || isAssetListError
    : isUserFundingsError || isAssetListError
  const formattedData = useMemo(() => {
    if (!fundingHistory) return []
    return formatFundingHistory(
      fundingHistory,
      assetList,
      !isViewAll && Boolean(data?.isSnapshot),
    )
  }, [fundingHistory, assetList, isViewAll, data?.isSnapshot])

  const refetch = useCallback(async () => {
    if (!address) return []

    const result = await allFundingHistoryQuery.refetch()
    if (!result.data) return []

    return formatFundingHistory(
      formatAllFundingHistory(result.data),
      assetList,
      false,
    )
  }, [address, allFundingHistoryQuery.refetch, assetList])

  return useMemo(() => {
    if (!address) {
      return {
        data: [],
        isLoading: false,
        isError: false,
        refetch,
      }
    }
    return {
      data: formattedData,
      isLoading,
      isError,
      refetch,
    }
  }, [isLoading, isError, formattedData, address, refetch])
}

export type FundingHistoryItemType = ReturnType<
  typeof useFundingHistory
>['data'][number]
