import { EVM_UI_FEE_DECIMAL } from 'src/config'
import { type Amount, type Fraction, Percent } from 'sushi'
import { type EvmCurrency, isLsd, isStable, isWrapOrUnwrap } from 'sushi/evm'
import type { Address } from 'viem'

const FEE_WHITELIST = ['0xc6164db338890e7a5e05d8a066c4ad54379c5a33']

export const isAddressFeeWhitelisted = (address: Address) =>
  FEE_WHITELIST.includes(address.toLowerCase())

export function getEvmSwapFee({
  fromToken,
  toToken,
  fee = EVM_UI_FEE_DECIMAL,
}: {
  fromToken: EvmCurrency | undefined
  toToken: EvmCurrency | undefined
  fee?: number
}): number {
  if (
    fromToken &&
    toToken &&
    (isWrapOrUnwrap({ from: fromToken, to: toToken }) ||
      (isStable(fromToken) && isStable(toToken)) ||
      (isLsd(fromToken) && isLsd(toToken)))
  ) {
    return 0
  }
  return fee
}

export const getFeeString = ({
  fromToken,
  toToken,
  tokenOutPrice,
  minAmountOut,
  fee = EVM_UI_FEE_DECIMAL,
}: {
  fromToken: EvmCurrency
  toToken: EvmCurrency
  tokenOutPrice: Fraction | undefined
  minAmountOut: Amount<EvmCurrency>
  fee?: number
}) => {
  return getEvmSwapFee({ fromToken, toToken, fee }) > 0
    ? `${tokenOutPrice ? '$' : ''}${minAmountOut
        .mul(
          new Percent({
            numerator: Math.round(fee * 10_000),
            denominator: 10_000,
          }),
        )
        .mul(tokenOutPrice ? tokenOutPrice.asFraction : 1n)
        .toSignificant(4)}${!tokenOutPrice ? ` ${toToken.symbol}` : ''}`
    : '$0'
}
