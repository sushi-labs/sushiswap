import { type UserFillsResponse, userFills } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { hlHttpTransport } from '../transports'
import { SPOT_ASSETS_TO_REWRITE, getPerpsDexAndCoin } from '../utils'

export const formatTradeHistoryItem = (
  fill: UserFillsResponse[number],
  assetList: ReturnType<
    typeof useAssetListState
  >['state']['assetListQuery']['data'],
) => {
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
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export const useTradeHistory = ({
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
      userFillsQuery: {
        data,
        isLoading: isLoadingFills,
        isError: isErrorFills,
      },
      aggregateFillsByTime,
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
  const allFillsQuery = useQuery({
    queryKey: ['useTradeHistory', 'all', address, aggregateFillsByTime],
    queryFn: async ({ signal }) => {
      if (!address) {
        throw new Error('address is undefined')
      }

      return await userFills(
        { transport: hlHttpTransport },
        { user: address, aggregateByTime: aggregateFillsByTime },
        signal,
      )
    },
    enabled: Boolean(address && isViewAll && enabled),
  })

  const fills = isViewAll ? allFillsQuery.data : data?.fills
  const isLoading = isViewAll
    ? allFillsQuery.isLoading || isAssetListLoading
    : isLoadingFills || isAssetListLoading
  const isError = isViewAll
    ? allFillsQuery.isError || isAssetListError
    : isErrorFills || isAssetListError

  const formattedData = useMemo(() => {
    if (!fills) return []
    return fills
      ?.map((fill) => {
        //HL outcomes (their prediction market) has a coin name that starts with a #, which is not a valid asset in our system. We will filter these out for now.
        if (fill?.coin?.startsWith('#')) return undefined
        return formatTradeHistoryItem(fill, assetList)
      })
      ?.filter(isDefined)
  }, [fills, assetList])

  const refetch = useCallback(async () => {
    if (!address) return []

    const result = await allFillsQuery.refetch()
    if (!result.data) return []

    return result.data
      .map((fill) => {
        //HL outcomes (their prediction market) has a coin name that starts with a #, which is not a valid asset in our system. We will filter these out for now.
        if (fill?.coin?.startsWith('#')) return undefined
        return formatTradeHistoryItem(fill, assetList)
      })
      .filter(isDefined)
  }, [address, allFillsQuery.refetch, assetList])

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

export type TradeHistoryItemType = ReturnType<
  typeof useTradeHistory
>['data'][number]
