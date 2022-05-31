import { Currency, CurrencyAmount, JSBI, Percent, TradeType, ZERO } from '@sushiswap/core-sdk'
import { Trade as LegacyTrade } from '@sushiswap/core-sdk/dist/entities/Trade'
import { LTV, PADDING } from 'app/features/kashi/constants'
import KashiMediumRiskLendingPair from 'app/features/kashi/KashiMediumRiskLendingPair'
import { computeRealizedLPFeePercent } from 'app/functions'
import { useV2TradeExactIn } from 'app/hooks/useV2Trades'
import { useAppSelector } from 'app/state/hooks'
import { selectSlippage } from 'app/state/slippage/slippageSlice'
import { useMemo } from 'react'

interface UseMaxBorrowPayload {
  leveraged: boolean
  collateralAmount?: CurrencyAmount<Currency>
  borrowAmount?: CurrencyAmount<Currency>
  market: KashiMediumRiskLendingPair
}

type UseMaxBorrow = (x: UseMaxBorrowPayload) => {
  maxBorrow?: CurrencyAmount<Currency>
  priceImpact?: Percent
  trade?: LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT>
}

export const useMaxBorrow: UseMaxBorrow = ({ leveraged, collateralAmount, borrowAmount, market }) => {
  const trade = useV2TradeExactIn(borrowAmount, collateralAmount?.currency, { maxHops: 3 })
  const allowedSlippage = useAppSelector(selectSlippage)
  const swapCollateralAmount = leveraged ? trade?.minimumAmountOut(allowedSlippage) : undefined

  const priceImpact = useMemo(() => {
    if (!trade) return undefined
    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    return realizedLpFeePercent ? trade.priceImpact.subtract(realizedLpFeePercent.asFraction) : undefined
  }, [trade])

  if (!collateralAmount || !borrowAmount) {
    return {
      maxBorrow: undefined,
      priceImpact: undefined,
      trade: undefined,
    }
  }

  const userCollateralAmount = CurrencyAmount.fromRawAmount(collateralAmount.currency, market.userCollateralAmount)

  // Calculate total collateral amount
  let userTotalCollateral = userCollateralAmount.add(collateralAmount)
  if (swapCollateralAmount) {
    userTotalCollateral = userTotalCollateral.add(swapCollateralAmount)
  }

  const borrowableOracleAmount = JSBI.greaterThan(market.oracleExchangeRate, JSBI.BigInt(0))
    ? userTotalCollateral.multiply(LTV).multiply(JSBI.BigInt(1e18)).divide(JSBI.BigInt(market.oracleExchangeRate))
        .asFraction
    : CurrencyAmount.fromRawAmount(userTotalCollateral.currency, '0')
  const borrowableSpotAmount = JSBI.greaterThan(market.spotExchangeRate, JSBI.BigInt(0))
    ? userTotalCollateral.multiply(LTV).multiply(JSBI.BigInt(1e18)).divide(JSBI.BigInt(market.spotExchangeRate))
        .asFraction
    : CurrencyAmount.fromRawAmount(userTotalCollateral.currency, '0')

  const borrowableMinimum = borrowableOracleAmount.lessThan(borrowableSpotAmount)
    ? borrowableOracleAmount
    : borrowableSpotAmount
  const borrowableMinimumPadded = borrowableMinimum
    .multiply(PADDING)
    .asFraction.subtract(CurrencyAmount.fromRawAmount(borrowAmount.currency, market.currentUserBorrowAmount || '0'))
  const maxAvailableBorrow = CurrencyAmount.fromRawAmount(borrowAmount.currency, market.maxAssetAvailable.toString())

  return {
    maxBorrow: borrowableMinimumPadded.greaterThan(ZERO)
      ? borrowableMinimumPadded.greaterThan(maxAvailableBorrow)
        ? maxAvailableBorrow
        : CurrencyAmount.fromRawAmount(borrowAmount.currency, borrowableMinimumPadded.quotient)
      : CurrencyAmount.fromRawAmount(borrowAmount.currency, '0'),
    priceImpact,
    trade: trade ?? undefined,
  }
}
