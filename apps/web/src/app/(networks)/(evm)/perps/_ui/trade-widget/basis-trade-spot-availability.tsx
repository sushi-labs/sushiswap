'use client'
import { useMemo, useState } from 'react'
import {
  type BalanceItemType,
  perpsNumberFormatter,
  useBalances,
  useSymbolSplit,
  useUserAccountValues,
} from 'src/lib/perps'
import { useUserState } from '~evm/perps/user-provider'
import { StatItem, TableButton } from '../_common'
import { SwapStablesDialog } from '../account-management/swap-stables-dialog'
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
  const [open, setOpen] = useState(false)

  if (!basisTradeAsset) return null

  const availablePerp =
    tradeSide === 'long' ? availableToShort : availableToLong

  const buttonText = `${perpsNumberFormatter({
    value: availablePerp,
    minFraxDigits: 2,
    maxFraxDigits: 2,
  })} ${quoteSymbol}`

  return (
    <>
      <StatItem
        title="Available Perp Trade"
        value={
          basisTradeAsset?.perpAsset?.dex !== '' && quoteSymbol !== 'USDC' ? (
            <TableButton onClick={() => setOpen(true)}>
              {buttonText}
            </TableButton>
          ) : (
            <>{buttonText}</>
          )
        }
      />
      {open ? (
        <SwapStablesDialog
          trigger={<div />}
          nonSelectableSwapData={{
            assetSymbolToSend: 'USDC',
            assetSymbolToBuy: quoteSymbol,
          }}
          isOpen={open}
          onOpenChange={setOpen}
        />
      ) : null}
    </>
  )
}

export const BasisTradeSpotAvailability = () => {
  const {
    state: { basisTradeAsset, tradeSide },
  } = useAssetState()
  const { spotBaseBalance, spotBaseSymbol, spotQuoteBalance, spotQuoteSymbol } =
    useBasisTradeAccountBalances({ basisTradeAsset })

  if (!basisTradeAsset) return null

  const availableSpot =
    tradeSide === 'long'
      ? (spotQuoteBalance?.availableBalance ?? '0')
      : (spotBaseBalance?.availableBalance ?? '0')

  return (
    <StatItem
      title="Available Spot Trade"
      value={
        availableSpot
          ? tradeSide === 'long'
            ? `${perpsNumberFormatter({
                value: availableSpot,
                minFraxDigits: 2,
                maxFraxDigits: 2,
              })} ${spotQuoteSymbol}`
            : `${perpsNumberFormatter({
                value: availableSpot,
                maxFraxDigits: basisTradeAsset.spotAsset.formatParseDecimals,
              })} ${spotBaseSymbol}`
          : '0'
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
