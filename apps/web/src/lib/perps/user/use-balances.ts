import { useMemo } from 'react'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useActiveAccountState } from '~evm/perps/active-account-provider'
import { useUserState } from '~evm/perps/user-provider'
import { DEX_NAME_TO_COIN, SPOT_ASSETS_TO_REWRITE } from '../utils'

export const useBalances = () => {
  const {
    state: { activeAddress },
  } = useActiveAccountState()
  const address = activeAddress
  const {
    state: {
      allDexClearinghouseStateQuery: {
        data,
        isLoading: isLoadingAllDexClearinghouse,
        isError: isErrorAllDexClearinghouse,
      },
      spotStateQuery: {
        data: spotState,
        isLoading: isSpotStateLoading,
        isError: isSpotStateError,
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
  const {
    state: { isUnifiedAccountModeEnabled, isDexAbstractionEnabled },
  } = useUserSettingsState()
  const isLoading =
    isLoadingAllDexClearinghouse || isAssetListLoading || isSpotStateLoading
  const isError =
    isErrorAllDexClearinghouse || isAssetListError || isSpotStateError

  const formattedData = useMemo(() => {
    if (!data) return []

    let perpsUsdcs = data?.clearinghouseStates
      .flatMap(([dexName, clearinghouseState]) => {
        return {
          coin: DEX_NAME_TO_COIN.get(dexName) ?? `USDC (Perps)`,
          totalBalance: clearinghouseState?.marginSummary?.accountValue,
          availableBalance: clearinghouseState?.withdrawable,
          usdcValue: clearinghouseState?.marginSummary?.accountValue,
          pnlRoePc: null,
          token: null,
          marketType: 'perp' as const,
          assetName: null,
          dex: dexName,
        }
      })
      .filter((b) => Number(b.usdcValue) > 0)

    const spotBalances =
      spotState?.spotState?.balances
        ?.map((i) => {
          if (i.total === '0.0') return null
          const tokenIndex = i.token
          const spot = Array.from(assetList?.entries() ?? []).find(([, v]) =>
            v?.tokens?.find((t) => t?.index === tokenIndex),
          )?.[1]
          if (!spot) {
            return null
          }
          const price = i.coin === 'USDC' ? 1 : (Number(spot?.markPrice) ?? 0)
          let total = Number(i.total || 0)

          const perpBalance = perpsUsdcs.find(
            (p) => p.coin.replaceAll(' (Perps)', '') === i.coin && p.dex !== '',
          )
          if (isDexAbstractionEnabled && perpBalance && i.coin !== 'USDC') {
            total += Number(perpBalance.totalBalance)
          }
          const usdcValue = total * price
          const entry =
            isDexAbstractionEnabled && perpBalance
              ? usdcValue
              : Number(i.entryNtl || 0)
          const pnl = usdcValue - entry
          const roePc = entry > 0 ? (pnl / entry) * 100 : null
          const _coin = SPOT_ASSETS_TO_REWRITE.has(i.coin)
            ? SPOT_ASSETS_TO_REWRITE.get(i.coin)
            : i.coin
          let availableBalance = total - Number(i?.hold || 0)
          if (isDexAbstractionEnabled && perpBalance && i.coin !== 'USDC') {
            availableBalance -= Number(perpBalance.totalBalance)
          }
          return {
            coin:
              i.coin === 'USDC'
                ? 'USDC (Spot)'
                : `${_coin}${isDexAbstractionEnabled && perpBalance ? ' (Spot + Perps)' : ''}`,
            assetName: spot?.name,
            totalBalance: total.toString(),
            availableBalance: availableBalance.toString(),
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
            dex: '',
          }
        })
        ?.filter((b) => b !== null) ?? []

    if (isDexAbstractionEnabled) {
      const getBaseCoin = (coin: string) => coin.split(' ')[0]

      const totalsByStable = perpsUsdcs.reduce<
        Record<
          string,
          {
            coin: string
            totalBalance: number
            availableBalance: number
            usdcValue: number
          }
        >
      >((acc, b) => {
        const baseCoin = getBaseCoin(b.coin)

        const hasSpot = spotBalances.some(
          (s) =>
            s.coin.includes('Spot + Perps') && getBaseCoin(s.coin) === baseCoin,
        )

        if (hasSpot) {
          return acc
        }

        acc[baseCoin] ??= {
          coin: baseCoin,
          totalBalance: 0,
          availableBalance: 0,
          usdcValue: 0,
        }

        acc[baseCoin].totalBalance += Number(b.totalBalance)
        acc[baseCoin].availableBalance += Number(b.availableBalance)
        acc[baseCoin].usdcValue += Number(b.usdcValue)

        return acc
      }, {})
      const totalsByStableArray = Object.values(totalsByStable)
      perpsUsdcs = totalsByStableArray.map((t) => ({
        coin: `${t.coin} (Perps)`,
        totalBalance: t.totalBalance.toString(),
        availableBalance: t.availableBalance.toString(),
        usdcValue: t.usdcValue.toString(),
        pnlRoePc: null,
        token: null,
        marketType: 'perp' as const,
        assetName: null,
        dex: '',
      }))
    }

    const allBalances = [...perpsUsdcs, ...spotBalances]
    if (!isUnifiedAccountModeEnabled) {
      return allBalances
    }
    const nonUsdcBalances =
      allBalances
        ?.filter((b) => b.coin !== 'USDC (Perps)' && b.coin !== 'USDC (Spot)')
        .map((b) => {
          const hasPerp = perpsUsdcs.find(
            (p) => p.coin.replaceAll(' (Perps)', '') === b.coin,
          )
          const totalBalance = hasPerp
            ? Number(b.totalBalance) + Number(hasPerp.totalBalance)
            : Number(b.totalBalance)
          const availableBalance = hasPerp
            ? Number(b.availableBalance) + Number(hasPerp.availableBalance)
            : Number(b.availableBalance)

          const usdcValue = hasPerp
            ? Number(b.usdcValue) + Number(hasPerp.usdcValue)
            : Number(b.usdcValue)
          const pnlRoePc = hasPerp ? null : b.pnlRoePc

          return {
            ...b,
            totalBalance: totalBalance.toString(),
            availableBalance: availableBalance.toString(),
            usdcValue: usdcValue.toString(),
            pnlRoePc,
          }
        })
        ?.filter((b) => !b.coin.includes('Perps')) ?? []
    const usdcBalance = spotState?.spotState?.balances?.find(
      (b) => b.coin === 'USDC',
    )

    const usdc = {
      coin: 'USDC',
      assetName: 'PURR/USDC',
      totalBalance: usdcBalance?.total ?? '0',
      availableBalance: (
        Number(usdcBalance?.total) - Number(usdcBalance?.hold ?? 0)
      ).toString(),
      usdcValue: usdcBalance?.total ?? '0',
      pnlRoePc: null,
      token: null,
      marketType: 'unified' as const,
      dex: '',
    }
    return [usdc, ...nonUsdcBalances]
  }, [
    data,
    assetList,
    spotState?.spotState?.balances,
    isUnifiedAccountModeEnabled,
    isDexAbstractionEnabled,
  ])

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

export type BalanceItemType = ReturnType<typeof useBalances>['data'][number]

export const useBalance = ({
  assetString,
  coin,
}: { assetString: string; coin?: string }) => {
  const { data: balances } = useBalances()
  return useMemo(() => {
    return balances?.find(
      (b) => b.assetName === assetString && (!coin || b.coin === coin),
    )
  }, [balances, assetString, coin])
}
