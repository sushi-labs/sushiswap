import { type Amount, type Fraction, Percent } from 'sushi'
import { type EvmCurrency, isLsd, isStable, isWrapOrUnwrap } from 'sushi/evm'

export const getFeeString = ({
  fromToken,
  toToken,
  tokenOutPrice,
  minAmountOut,
}: {
  fromToken: EvmCurrency
  toToken: EvmCurrency
  tokenOutPrice: Fraction | undefined
  minAmountOut: Amount<EvmCurrency>
}) => {
  return !isWrapOrUnwrap({ from: fromToken, to: toToken }) &&
    !(isStable(fromToken) && isStable(toToken)) &&
    !(isLsd(fromToken) && isLsd(toToken))
    ? `${tokenOutPrice ? '$' : ''}${minAmountOut
        .mul(new Percent({ numerator: 25, denominator: 10000 }))
        .mul(tokenOutPrice ? tokenOutPrice.asFraction : 1n)
        .toSignificant(4)}${!tokenOutPrice ? ` ${toToken.symbol}` : ''}`
    : '$0'
}
