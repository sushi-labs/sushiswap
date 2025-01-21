import { Amount, Type } from 'sushi/currency'
import { Fraction, Percent } from 'sushi/math'
import { isLsd, isStable, isWrapOrUnwrap } from 'sushi/router'

export const getFeeString = ({
  fromToken,
  toToken,
  tokenOutPrice,
  minAmountOut,
}: {
  fromToken: Type
  toToken: Type
  tokenOutPrice: Fraction | undefined
  minAmountOut: Amount<Type>
}) => {
  return !isWrapOrUnwrap({ fromToken, toToken }) &&
    !isStable({ fromToken, toToken }) &&
    !isLsd({ fromToken, toToken })
    ? `${tokenOutPrice ? '$' : ''}${minAmountOut
        .multiply(new Percent(25, 10000))
        .multiply(tokenOutPrice ? tokenOutPrice.asFraction : 1)
        .toSignificant(4)} ${!tokenOutPrice ? toToken.symbol : ''}`
    : '$0'
}
