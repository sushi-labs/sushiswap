import { JSBI, ZERO } from '@sushiswap/core-sdk'
import { PROTOCOL_FEE, PROTOCOL_FEE_DIVISOR } from '@sushiswap/kashi-sdk'

import { KashiMediumRiskLendingPair } from './KashiMediumRiskLendingPair'

export function accrueTotalAssetWithFee(pair: KashiMediumRiskLendingPair): {
  elastic: JSBI
  base: JSBI
} {
  const extraAmount = JSBI.divide(
    JSBI.multiply(
      JSBI.multiply(pair.totalBorrow.elastic, pair.accrueInfo.interestPerSecond),
      JSBI.add(pair.elapsedSeconds, JSBI.BigInt(3600)) // For some transactions, to succeed in the next hour (and not only this block), some margin has to be added
    ),
    JSBI.BigInt(1e18)
  )
  const feeAmount = JSBI.divide(JSBI.multiply(extraAmount, PROTOCOL_FEE), PROTOCOL_FEE_DIVISOR) // % of interest paid goes to fee
  const feeFraction = JSBI.greaterThan(pair.currentAllAssets, ZERO)
    ? JSBI.divide(JSBI.multiply(feeAmount, pair.totalAsset.base), pair.currentAllAssets)
    : ZERO
  return {
    elastic: pair.totalAsset.elastic,
    base: JSBI.add(pair.totalAsset.base, feeFraction),
  }
}
