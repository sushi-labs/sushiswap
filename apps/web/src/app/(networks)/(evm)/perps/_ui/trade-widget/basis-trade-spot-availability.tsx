'use client'
import { useMemo } from 'react'
import {
  type BalanceItemType,
  currencyFormatter,
  perpsNumberFormatter,
  useBalances,
  useSymbolSplit,
  useUserAccountValues,
} from 'src/lib/perps'
import { useUserState } from '~evm/perps/user-provider'
import { StatItem } from '../_common'
import type { BasisTradeAsset } from '../asset-selector'
import { useAssetState } from './asset-state-provider'

export function useBasisTradeAccountBalances({
  basisTradeAsset,
}: {
  basisTradeAsset: BasisTradeAsset | undefined
}) {
  const { data: balances, isLoading: isBalancesLoading } = useBalances()
  const { spotEquity, isLoading: isAccountValuesLoading } =
    useUserAccountValues()
  const {
    state: {
      allDexClearinghouseStateQuery: {
        data: allDexClearinghouseState,
        isLoading: isAllDexClearinghouseStateLoading,
      },
    },
  } = useUserState()
  const { baseSymbol: spotBaseSymbol, quoteSymbol: spotQuoteSymbol } =
    useSymbolSplit({
      asset: basisTradeAsset?.spotAsset,
    })
  const { quoteSymbol: perpQuoteSymbol } = useSymbolSplit({
    asset: basisTradeAsset?.perpAsset,
  })

  const spotBaseBalance = useMemo(() => {
    if (!basisTradeAsset) return undefined

    return getBasisTradeSpotTokenBalance({
      balances,
      tokenIndex: basisTradeAsset.spotAsset.tokens?.[0]?.index,
      symbol: spotBaseSymbol,
    })
  }, [balances, basisTradeAsset, spotBaseSymbol])

  const spotQuoteBalance = useMemo(() => {
    if (!basisTradeAsset) return undefined

    return getBasisTradeSpotTokenBalance({
      balances,
      tokenIndex: basisTradeAsset.spotAsset.tokens?.[1]?.index,
      symbol: spotQuoteSymbol,
    })
  }, [balances, basisTradeAsset, spotQuoteSymbol])

  const perpsBalance = useMemo(() => {
    if (!basisTradeAsset || !allDexClearinghouseState) return undefined

    const clearinghouseState =
      allDexClearinghouseState.clearinghouseStates.find(
        ([dex]) => dex === basisTradeAsset.perpAsset.dex,
      )?.[1]

    if (!clearinghouseState) return undefined

    const unrealizedPnl = clearinghouseState.assetPositions.reduce(
      (acc, assetPosition) =>
        acc + Number(assetPosition.position.unrealizedPnl ?? 0),
      0,
    )

    return (
      Number(clearinghouseState.marginSummary?.accountValue ?? 0) -
      unrealizedPnl
    )
  }, [allDexClearinghouseState, basisTradeAsset])

  return {
    isLoading:
      isBalancesLoading ||
      isAccountValuesLoading ||
      isAllDexClearinghouseStateLoading,
    perpsBalance,
    perpQuoteSymbol,
    spotBaseBalance,
    spotBaseSymbol,
    spotEquity,
    spotQuoteBalance,
    spotQuoteSymbol,
  }
}

export const BasisTradePerpAvailability = () => {
  const {
    state: { availableToLong, availableToShort, basisTradeAsset, tradeSide },
  } = useAssetState()
  const { quoteSymbol } = useSymbolSplit({
    asset: basisTradeAsset?.perpAsset,
  })

  if (!basisTradeAsset) return null

  const availablePerp =
    tradeSide === 'long' ? availableToShort : availableToLong

  return (
    <StatItem
      title="Available Perp"
      value={`${perpsNumberFormatter({
        value: availablePerp,
        minFraxDigits: 2,
        maxFraxDigits: 2,
      })} ${quoteSymbol}`}
    />
  )
}

export const BasisTradeSpotAvailability = () => {
  const {
    state: { basisTradeAsset, tradeSide },
  } = useAssetState()
  const { spotBaseBalance, spotBaseSymbol, spotEquity } =
    useBasisTradeAccountBalances({ basisTradeAsset })

  if (!basisTradeAsset) return null

  const availableSpot =
    tradeSide === 'long'
      ? spotEquity.toString()
      : spotBaseBalance?.availableBalance

  return (
    <StatItem
      title="Available Spot"
      value={
        availableSpot
          ? tradeSide === 'long'
            ? currencyFormatter.format(Number(availableSpot))
            : `${perpsNumberFormatter({
                value: availableSpot,
                maxFraxDigits: basisTradeAsset.spotAsset.formatParseDecimals,
              })} ${spotBaseSymbol}`
          : 'N/A'
      }
    />
  )
}

function getBasisTradeSpotTokenBalance({
  balances,
  tokenIndex,
  symbol,
}: {
  balances: BalanceItemType[]
  tokenIndex: number | undefined
  symbol: string
}): BalanceItemType | undefined {
  return (
    balances.find(
      (balance) =>
        tokenIndex !== undefined &&
        isSpotLikeBalance(balance) &&
        balance.token?.index === tokenIndex,
    ) ??
    balances.find(
      (balance) =>
        isSpotLikeBalance(balance) &&
        (balance.coin === symbol ||
          balance.coin.startsWith(`${symbol} `) ||
          balance.coin.startsWith(`${symbol} (`)),
    )
  )
}

function isSpotLikeBalance(balance: BalanceItemType): boolean {
  return balance.marketType === 'spot' || balance.marketType === 'unified'
}
