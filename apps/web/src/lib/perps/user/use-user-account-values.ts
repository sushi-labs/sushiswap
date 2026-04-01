import { useMemo } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-selector'
import { useUserState } from '~evm/perps/user-provider'
import { useAccount } from '../../wallet'
import { useSpotClearinghouseState } from '../info'

//todo: pull from api
export const DEX_COLLATERAL_TOKENS = {
  '': {
    index: 0,
    collateralToken: 0,
  },
  abcd: {
    index: 1,
    collateralToken: 0,
  },
  cash: {
    index: 2,
    collateralToken: 268,
  },
  flx: {
    index: 3,
    collateralToken: 360,
  },
  hyna: {
    index: 4,
    collateralToken: 235,
  },
  km: {
    index: 5,
    collateralToken: 360,
  },
  vntl: {
    index: 6,
    collateralToken: 360,
  },
  xyz: {
    index: 7,
    collateralToken: 0,
  },
}

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
  const {
    data: spotClearingHouseState,
    isLoading: isLoadingSpotClearingHouse,
    error: errorSpotClearingHouse,
  } = useSpotClearinghouseState({ address })

  const isLoading = useMemo(() => {
    if (!address) return false
    return (
      isLoadingWebData2 ||
      allDexLoading ||
      assetListLoading ||
      isLoadingSpotClearingHouse
    )
  }, [
    address,
    isLoadingWebData2,
    allDexLoading,
    assetListLoading,
    isLoadingSpotClearingHouse,
  ])

  const error = useMemo(() => {
    if (!address) return null
    return (
      errorWebData2 || allDexError || assetListError || errorSpotClearingHouse
    )
  }, [
    address,
    errorWebData2,
    allDexError,
    assetListError,
    errorSpotClearingHouse,
  ])

  const spotEquity = useMemo(() => {
    if (!webData2?.spotState?.balances || !assetList) return 0

    return (
      webData2?.spotState?.balances?.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        const tokenIndex = asset?.token
        const spot = Array.from(assetList?.entries() ?? []).find(([, v]) =>
          v?.tokens?.find((t) => t?.index === tokenIndex),
        )?.[1]
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [webData2?.spotState?.balances, assetList])

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

  const portfolioValue = useMemo(() => {
    return perpsEquity + spotEquity
  }, [perpsEquity, spotEquity])

  const clearhouseStateTotal = useMemo(() => {
    if (!spotClearingHouseState?.balances || !assetList) return 0

    return (
      spotClearingHouseState?.balances?.reduce((acc, asset) => {
        const balance = Number(asset?.total) ?? 0
        if (asset.coin === 'USDC') {
          return acc + balance
        }
        const tokenIndex = asset?.token
        //if tokenIndex not in DEX_COLLATERAL_TOKENS, skip
        if (
          !Object.values(DEX_COLLATERAL_TOKENS).find(
            (meta) => meta.collateralToken === tokenIndex,
          )
        ) {
          return acc
        }
        const spot = Array.from(assetList?.entries() ?? []).find(([, v]) =>
          v?.tokens?.find((t) => t?.index === tokenIndex),
        )?.[1]
        const price = Number(spot?.lastPrice) ?? 0
        const val = balance * price
        return acc + val
      }, 0) ?? 0
    )
  }, [spotClearingHouseState?.balances, assetList])

  const unifiedAccountLeverage = useMemo(() => {
    if (!allDexClearinghouseState) return 0

    const isolatedValue =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          const crossPosValue = pos.assetPositions.reduce(
            (assetAcc, assetPos) => {
              if (assetPos.position.leverage.type === 'cross') return assetAcc
              const posValue = Number(assetPos.position.positionValue ?? 0)
              return assetAcc + posValue
            },
            0,
          )
          return posAcc + crossPosValue
        },
        0,
      ) || 0
    const crossValue =
      allDexClearinghouseState?.clearinghouseStates.reduce(
        (posAcc, [_dex, pos]) => {
          const crossPosValue = pos.assetPositions.reduce(
            (assetAcc, assetPos) => {
              if (assetPos.position.leverage.type === 'isolated')
                return assetAcc
              const posValue = Number(assetPos.position.positionValue ?? 0)
              return assetAcc + posValue
            },
            0,
          )
          return posAcc + crossPosValue
        },
        0,
      ) || 0

    return crossValue / (isolatedValue + clearhouseStateTotal || 1)
  }, [allDexClearinghouseState, clearhouseStateTotal])

  const unifiedAccountRatio = useMemo(() => {
    // https://hyperliquid.gitbook.io/hyperliquid-docs/trading/account-abstraction-modes#unified-account-ratio
    const crossMarginByToken: Record<number, number> = {}
    const isolatedMarginByToken: Record<number, number> = {}
    const indexToCollateralToken: Record<number, number> = {}
    for (const meta of Object.values(DEX_COLLATERAL_TOKENS)) {
      indexToCollateralToken[meta.index] = meta.collateralToken
    }
    const perpDexStates =
      allDexClearinghouseState?.clearinghouseStates?.flatMap(
        ([_dexName, clearinghouseState]) => {
          return clearinghouseState
        },
      ) ?? []
    // console.log('perpDexStates', perpDexStates)
    for (let index = 0; index < perpDexStates.length; index++) {
      const dex = perpDexStates[index]
      const token = indexToCollateralToken[index]

      if (dex === undefined || token === undefined) continue

      crossMarginByToken[token] =
        (crossMarginByToken[token] ?? 0) +
        Number(dex.crossMaintenanceMarginUsed)

      for (const ap of dex.assetPositions) {
        if (ap.position.leverage.type === 'isolated') {
          isolatedMarginByToken[token] =
            (isolatedMarginByToken[token] ?? 0) + Number(ap.position.marginUsed)
        }
      }
    }
    let maxRatio = 0
    for (const [tokenStr, crossMargin] of Object.entries(crossMarginByToken)) {
      const token = Number(tokenStr)
      const spotTotal =
        spotClearingHouseState?.balances?.find((b) => b.token === token)
          ?.total ?? 0
      const isolatedMargin = isolatedMarginByToken[token] ?? 0
      const available = Number(spotTotal) - isolatedMargin
      if (available > 0) {
        maxRatio = Math.max(maxRatio, crossMargin / available)
      }
    }

    return maxRatio * 100
  }, [allDexClearinghouseState, spotClearingHouseState?.balances])

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
    portfolioValue,
    unifiedAccountLeverage,
    unifiedAccountRatio,
  }
}
