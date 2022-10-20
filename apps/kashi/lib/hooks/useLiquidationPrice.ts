import { Amount, Price, Type } from '@sushiswap/currency'
import { Trade, TradeType, Version } from '@sushiswap/amm'
import { Fraction, Percent, ZERO } from '@sushiswap/math'
import { usePrices } from '@sushiswap/wagmi'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { useMemo } from 'react'

import { useSettings } from '../state/storage'
import { useTokensFromKashiPair } from './useTokensFromKashiPair'

export const LTV = new Fraction(75, 100)

interface Payload {
  pair: KashiMediumRiskLendingPairV1
  borrowAmount?: Amount<Type>
  collateralAmount?: Amount<Type>
  trade?: Trade<Type, Type, TradeType.EXACT_INPUT, Version.V1> | null
  reduce: boolean
}

type UseLiquidationPrice = (x: Payload) => Price<Type, Type> | null | undefined

export const useLiquidationPrice: UseLiquidationPrice = ({ pair, borrowAmount, collateralAmount, trade, reduce }) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const [{ slippageTolerance }] = useSettings()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  // TODO Use KashiPair Class here
  // const { market } = useKashiMarket()
  // const currentCollateralAmount = Amount.fromRawAmount(collateral, market.userCollateralAmount)
  // const currentBorrowedAmount = Amount.fromRawAmount(asset, market.currentUserBorrowAmount)
  const currentCollateralAmount = Amount.fromRawAmount(collateral, '0')
  const currentBorrowedAmount = Amount.fromRawAmount(asset, '0')
  const collateralAssetPrice = prices?.[collateral.wrapped.address]

  try {
    const extraCollateral =
      collateralAmount && trade
        ? collateralAmount[reduce ? 'subtract' : 'add'](trade.minimumAmountOut(slippagePercent))
        : collateralAmount

    const totalCollateral = extraCollateral
      ? currentCollateralAmount[reduce ? 'subtract' : 'add'](extraCollateral)
      : currentCollateralAmount
    const totalBorrowed = borrowAmount
      ? currentBorrowedAmount[reduce ? 'subtract' : 'add'](borrowAmount)
      : currentBorrowedAmount

    if (totalBorrowed.equalTo(ZERO)) return undefined

    const liquidationPrice =
      totalBorrowed && totalCollateral && totalBorrowed.greaterThan(ZERO)
        ? new Price({ baseAmount: totalBorrowed, quoteAmount: totalCollateral.multiply(LTV) })
        : undefined

    const liqPriceNumber = Number(liquidationPrice?.invert().toSignificant(6))
    const assetPriceNumber = Number(collateralAssetPrice?.toSignificant(6))

    if (liqPriceNumber > assetPriceNumber || Number(liquidationPrice?.invert().toSignificant(6)) < 0) {
      // Instant
      return null
    } else if (!liqPriceNumber) {
      // None
      return undefined
    }

    return liquidationPrice
  } catch (e) {
    console.log(e)
    // Instant
    return null
  }
}
