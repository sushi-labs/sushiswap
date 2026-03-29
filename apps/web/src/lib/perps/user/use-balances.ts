import { useMemo } from 'react'
import { useUserSettingsState } from '~evm/perps/_ui/account-management'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'
import { SPOT_ASSETS_TO_REWRITE } from '../utils'

const DEX_NAME_TO_COIN: Record<string, string> = {
  '': 'USDC (Perps)',
  xyz: 'USDC (Perps)',
  cash: 'USDT0 (Perps)',
  flx: 'USDH (Perps)',
  hyna: 'USDE (Perps)',
  km: 'USDH (Perps)',
  vntl: 'USDH (Perps)',
}

export const useBalances = () => {
  const address = useAccount('evm')
  const {
    state: {
      allDexClearinghouseStateQuery: {
        data,
        isLoading: isLoadingAllDexClearinghouse,
        isError: isErrorAllDexClearinghouse,
      },
      webData2Query: {
        data: webData2Data,
        isLoading: isWebData2Loading,
        isError: isWebData2Error,
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
    state: { isUnifiedAccountModeEnabled },
  } = useUserSettingsState()

  const isLoading =
    isLoadingAllDexClearinghouse || isAssetListLoading || isWebData2Loading
  const isError =
    isErrorAllDexClearinghouse || isAssetListError || isWebData2Error

  const formattedData = useMemo(() => {
    if (!data) return []

    const perpsUsdcs = data?.clearinghouseStates
      .flatMap(([dexName, clearinghouseState]) => {
        return {
          coin: DEX_NAME_TO_COIN[dexName] ?? `USDC (Perps)`,
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
      webData2Data?.spotState?.balances?.map((i) => {
        const tokenIndex = i.token
        const spot = assetList
          ?.entries?.()
          ?.find?.(([, v]) =>
            v?.tokens?.find((t) => t?.index === tokenIndex),
          )?.[1]
        const price = i.coin === 'USDC' ? 1 : (Number(spot?.markPrice) ?? 0)
        const usdcValue = Number(i.total || 0) * price
        const entry = Number(i.entryNtl || 0)
        const pnl = usdcValue - entry
        const roePc = entry > 0 ? (pnl / entry) * 100 : null
        const _coin = SPOT_ASSETS_TO_REWRITE.has(i.coin)
          ? SPOT_ASSETS_TO_REWRITE.get(i.coin)
          : i.coin
        const availableBalance = Number(i?.total || 0) - Number(i?.hold || 0)
        return {
          coin: i.coin === 'USDC' ? 'USDC (Spot)' : _coin,
          assetName: spot?.name,
          totalBalance: i.total,
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
      }) ?? []

    const allBalances = [...perpsUsdcs, ...spotBalances]
    if (!isUnifiedAccountModeEnabled) {
      return allBalances
    }
    const nonUsdcBalances =
      allBalances?.filter(
        (b) => b.coin !== 'USDC (Perps)' && b.coin !== 'USDC (Spot)',
      ) ?? []
    const usdcBalances =
      allBalances?.filter(
        (b) => b.coin === 'USDC (Perps)' || b.coin === 'USDC (Spot)',
      ) ?? []
    const usdc = {
      coin: 'USDC',
      assetName: 'PURR/USDC',
      totalBalance: usdcBalances
        .reduce((acc, b) => acc + Number(b.totalBalance), 0)
        .toString(),
      availableBalance: usdcBalances
        .reduce((acc, b) => acc + Number(b.availableBalance), 0)
        .toString(),
      usdcValue: usdcBalances
        .reduce((acc, b) => acc + Number(b.usdcValue), 0)
        .toString(),
      pnlRoePc: null,
      token: null,
      marketType: 'unified' as const,
      dex: '',
    }
    return [usdc, ...nonUsdcBalances]
  }, [data, assetList, webData2Data, isUnifiedAccountModeEnabled])

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

export const useBalance = ({ assetString }: { assetString: string }) => {
  const { data: balances } = useBalances()
  return useMemo(() => {
    return balances?.find((b) => b.assetName === assetString)
  }, [balances, assetString])
}
