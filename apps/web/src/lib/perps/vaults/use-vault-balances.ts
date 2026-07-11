import { useMemo } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import {
  useAllDexClearinghouseState,
  useSpotState,
  useWebData3,
} from '../subscription'
import { DEX_NAME_TO_COIN, SPOT_ASSETS_TO_REWRITE } from '../utils'

export const useVaultBalances = (vaultAddress: EvmAddress) => {
  const {
    data,
    isLoading: isLoadingAllDexClearinghouse,
    isError: isErrorAllDexClearinghouse,
  } = useAllDexClearinghouseState({ address: vaultAddress })
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
    data: spotState,
    isLoading: isSpotStateLoading,
    isError: isSpotStateError,
  } = useSpotState({ address: vaultAddress })

  const {
    data: webData3,
    isLoading: isWebData3Loading,
    isError: isWebData3Error,
  } = useWebData3({
    address: vaultAddress,
  })

  const isUnifiedAccountModeEnabled = useMemo(() => {
    return webData3?.userState?.abstraction === 'unifiedAccount'
  }, [webData3?.userState?.abstraction])

  const isDexAbstractionEnabled = useMemo(() => {
    return webData3?.userState?.dexAbstractionEnabled || false
  }, [webData3])

  const isLoading =
    isLoadingAllDexClearinghouse ||
    isAssetListLoading ||
    isSpotStateLoading ||
    isWebData3Loading
  const isError =
    isErrorAllDexClearinghouse ||
    isAssetListError ||
    isSpotStateError ||
    isWebData3Error

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
      const totals = perpsUsdcs.reduce(
        (acc, b) => {
          const hasSpot = spotBalances.find(
            (s) =>
              s.coin.includes('Spot + Perps') &&
              s.coin.split?.(' ')?.[0] === b.coin.split?.(' ')?.[0],
          )
          if (hasSpot) {
            return acc
          }
          return {
            totalBalance: acc.totalBalance + Number(b.totalBalance),
            availableBalance: acc.availableBalance + Number(b.availableBalance),
            usdcValue: acc.usdcValue + Number(b.usdcValue),
          }
        },
        { totalBalance: 0, availableBalance: 0, usdcValue: 0 },
      )

      perpsUsdcs = [
        {
          coin: 'USDC (Perps)',
          totalBalance: totals.totalBalance.toString(),
          availableBalance: totals.availableBalance.toString(),
          usdcValue: totals.usdcValue.toString(),
          pnlRoePc: null,
          token: null,
          marketType: 'perp' as const,
          assetName: null,
          dex: '',
        },
      ]
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
    if (!vaultAddress) {
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
  }, [isLoading, isError, formattedData, vaultAddress])
}
