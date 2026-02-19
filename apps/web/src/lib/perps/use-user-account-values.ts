import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector/asset-list-provider'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../wallet'

export const useUserAccountValues = () => {
  const address = useAccount('evm')
  const {
    state: {
      webData2Query: {
        data: webData2,
        isLoading: isLoadingWebData2,
        error: errorWebData2,
      },
      allDexClearinghouseStateQuery: {
        data: allDexClearinghouseState,
        isLoading: allDexLoading,
        error: allDexError,
      },
    },
  } = useUserState()
  const {
    state: {
      assetListQuery: {
        data: assetList,
        isLoading: assetListLoading,
        error: assetListError,
      },
    },
  } = useAssetListState()

  const isLoading = useMemo(() => {
    if (!address) return false
    return isLoadingWebData2 || allDexLoading || assetListLoading
  }, [address, isLoadingWebData2, allDexLoading, assetListLoading])

  const error = useMemo(() => {
    if (!address) return null
    return errorWebData2 || allDexError || assetListError
  }, [address, errorWebData2, allDexError, assetListError])

  const spotEquity = useMemo(() => {
    if (!webData2) return 0
    return (
      webData2?.spotState?.balances.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        //has to be better way to get this, wth. most likely not seeing it in the sdk
        const tokenIndex = asset?.token
        const spot = assetList
          ?.entries()
          .find(([, v]) => v.tokens?.find((t) => t.index === tokenIndex))?.[1]
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [webData2, assetList])

  const unrelaizedPnL = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return pos.assetPositions.reduce((assetAcc, assetPos) => {
          const unrealizedPnl = Number(assetPos.position.unrealizedPnl ?? 0)
          return assetAcc + unrealizedPnl
        }, posAcc)
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsEquity = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return allDexClearinghouseState?.clearinghouseStates.reduce(
      (posAcc, [_dex, pos]) => {
        return Number(pos.marginSummary?.accountValue ?? 0) + posAcc
      },
      0,
    )
  }, [allDexClearinghouseState])

  const perpsBalance = useMemo(() => {
    if (!perpsEquity) return 0
    return perpsEquity - (unrelaizedPnL || 0)
  }, [perpsEquity, unrelaizedPnL])

  const maintenanceMargin = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return (
      allDexClearinghouseState?.clearinghouseStates?.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.crossMaintenanceMarginUsed ?? 0) + posAcc
        },
        0,
      ) || 0
    )
  }, [allDexClearinghouseState])

  const totalCrossMarginRatio = useMemo(() => {
    if (!perpsEquity) return 0
    return (maintenanceMargin / (perpsEquity || 1)) * 100
  }, [maintenanceMargin, perpsEquity])

  const crossAccountLeverage = useMemo(() => {
    if (!perpsEquity || !allDexClearinghouseState) return 0
    const totalNtlPos =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.marginSummary?.totalNtlPos ?? 0) + posAcc
        },
        0,
      ) || 0

    return totalNtlPos / (perpsEquity || 1)
  }, [perpsEquity, allDexClearinghouseState])

  const withdrawableBalance = useMemo(() => {
    if (!allDexClearinghouseState) return 0
    return (
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          return Number(pos.withdrawable ?? 0) + posAcc
        },
        0,
      ) || 0
    )
  }, [allDexClearinghouseState])

  return {
    isLoading,
    error,
    spotEquity,
    unrelaizedPnL,
    perpsEquity,
    perpsBalance,
    maintenanceMargin,
    totalCrossMarginRatio,
    crossAccountLeverage,
    withdrawableBalance,
  }
}
