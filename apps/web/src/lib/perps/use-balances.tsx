import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'
import { SPOT_ASSETS_TO_REWRITE } from './utils'

export const useBalances = () => {
  const {
    state: {
      webData2Query: { data, isLoading: isLoadingWebData2, isError },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: { data: assetList, isLoading: isAssetListLoading },
    },
  } = useAssetListState()
  const isLoading = isLoadingWebData2 || isAssetListLoading

  const formattedData = useMemo(() => {
    if (!data) return []
    const perpUsdc = {
      coin: 'USDC (Perps)',
      totalBalance: data?.clearinghouseState?.marginSummary?.accountValue,
      availableBalance: data?.clearinghouseState?.withdrawable,
      usdcValue: data?.clearinghouseState?.marginSummary?.accountValue,
      pnlRoePc: null,
      token: null,
      marketType: 'perp' as const,
      assetName: null,
    }
    const spotBalances =
      data?.spotState?.balances?.map((i) => {
        const tokenIndex = i.token
        const spot = assetList
          ?.entries()
          .find(([, v]) => v.tokens?.find((t) => t.index === tokenIndex))?.[1]
        const price = i.coin === 'USDC' ? 1 : (Number(spot?.lastPrice) ?? 0)
        const usdcValue = Number(i.total || 0) * price
        const entry = Number(i.entryNtl || 0)
        const pnl = usdcValue - entry
        const roePc = entry > 0 ? (pnl / entry) * 100 : null
        const _coin = SPOT_ASSETS_TO_REWRITE.has(i.coin)
          ? SPOT_ASSETS_TO_REWRITE.get(i.coin)
          : i.coin
        return {
          coin: i.coin === 'USDC' ? 'USDC (Spot)' : _coin,
          assetName: spot?.name,
          totalBalance: i.total,
          availableBalance: i.total,
          usdcValue: usdcValue.toString(),
          pnlRoePc:
            i.coin === 'USDC'
              ? null
              : {
                  pnl,
                  roePc,
                },
          token: spot?.tokens?.find((t) => t.index === tokenIndex),
          marketType: 'spot' as const,
        }
      }) ?? []
    return [perpUsdc, ...spotBalances]
  }, [data, assetList])

  return useMemo(() => {
    return {
      data: formattedData,
      isLoading,
      isError,
    }
  }, [isLoading, isError, formattedData])
}

export type BalanceItemType = ReturnType<typeof useBalances>['data'][number]
