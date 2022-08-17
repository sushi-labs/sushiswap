import { Amount, Price, Type } from '@sushiswap/currency'
import { Trade, TradeType, Version } from '@sushiswap/exchange'
import { Fraction, Percent, ZERO } from '@sushiswap/math'
import { usePrices } from '@sushiswap/wagmi'
import { useMemo } from 'react'

import { KashiPair } from '../../.graphclient'
import { useSettings } from '../state/storage'
import { useTokensFromKashiPair } from './useTokensFromKashiPair'

export const LTV = new Fraction(75, 100)

interface Payload {
  pair: KashiPair
  borrowAmount?: Amount<Type>
  collateralAmount?: Amount<Type>
  trade?: Trade<Type, Type, TradeType.EXACT_INPUT, Version.V1> | null
  invert: boolean
  reduce: boolean
}

type UseLiquidationPrice = (x: Payload) => string

export const useLiquidationPrice: UseLiquidationPrice = ({
  pair,
  borrowAmount,
  collateralAmount,
  invert,
  trade,
  reduce,
}) => {
  const { asset, collateral } = useTokensFromKashiPair(pair)
  const { data: prices } = usePrices({ chainId: pair.chainId })
  const [{ slippageTolerance }] = useSettings()
  const slippagePercent = useMemo(() => {
    return new Percent(Math.floor(slippageTolerance * 100), 10_000)
  }, [slippageTolerance])

  // TODO WHEN KASHI MARKET ENTITY
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

    if (totalBorrowed.equalTo(ZERO)) return 'None'

    const liquidationPrice =
      totalBorrowed && totalCollateral && totalBorrowed.greaterThan(ZERO)
        ? new Price({ baseAmount: totalBorrowed, quoteAmount: totalCollateral.multiply(LTV) })
        : undefined

    const liqPriceNumber = Number(liquidationPrice?.invert().toSignificant(6))
    const assetPriceNumber = Number(collateralAssetPrice?.toSignificant(6))

    if (liqPriceNumber > assetPriceNumber || Number(liquidationPrice?.invert().toSignificant(6)) < 0) {
      return 'Instant liquidation'
    } else if (!liqPriceNumber) {
      return 'None'
    }

    return invert
      ? `1 ${totalBorrowed?.currency.symbol} = ${liquidationPrice?.toSignificant(6)} ${
          totalCollateral?.currency.symbol
        }`
      : `1 ${totalCollateral?.currency.symbol} = ${liquidationPrice?.invert().toSignificant(6)} ${
          totalBorrowed?.currency.symbol
        }`
  } catch (e) {
    console.log(e)
    return 'Instant liquidation'
  }
}
