import type { LifiXSwapSupportedChainId } from 'src/config'
import { type Amount, Fraction, Percent } from 'sushi'

interface CrossChainPriceImpactParams {
  amountIn: Amount<CurrencyFor<LifiXSwapSupportedChainId>> | undefined
  amountOut: Amount<CurrencyFor<LifiXSwapSupportedChainId>> | undefined
  tokenInPrice: Fraction | undefined
  tokenOutPrice: Fraction | undefined
}

export function getCrossChainPriceImpact({
  amountIn,
  amountOut,
  tokenInPrice,
  tokenOutPrice,
}: CrossChainPriceImpactParams): Percent | undefined {
  if (
    !amountIn ||
    !amountOut ||
    amountIn.amount <= 0n ||
    amountOut.amount < 0n ||
    !tokenInPrice ||
    !tokenOutPrice ||
    tokenInPrice.numerator <= 0n ||
    tokenInPrice.denominator <= 0n ||
    tokenOutPrice.numerator <= 0n ||
    tokenOutPrice.denominator <= 0n
  ) {
    return undefined
  }

  const inputUsd = new Fraction({
    numerator: amountIn.amount,
    denominator: 10n ** BigInt(amountIn.currency.decimals),
  }).mul(tokenInPrice)
  const outputUsd = new Fraction({
    numerator: amountOut.amount,
    denominator: 10n ** BigInt(amountOut.currency.decimals),
  }).mul(tokenOutPrice)

  // Measure the change against the input value. Dividing by the output
  // instead overstates losses and becomes undefined for a zero output.
  return new Percent(inputUsd.sub(outputUsd).div(inputUsd))
}
