import { EVM_UI_FEE_BIPS } from 'src/config'
import { type Amount, type Fraction, Percent } from 'sushi'
import { type EvmCurrency, isLsd, isStable, isWrapOrUnwrap } from 'sushi/evm'
import type { Address } from 'viem'

const FEE_WHITELIST = ['0xc6164db338890e7a5e05d8a066c4ad54379c5a33']

export const isAddressFeeWhitelisted = (address: Address) =>
  FEE_WHITELIST.includes(address.toLowerCase())

export const shouldChargeFee = ({
  fromToken,
  toToken,
  sender,
  recipient,
}: {
  fromToken: EvmCurrency | undefined
  toToken: EvmCurrency | undefined
  sender?: Address | undefined
  recipient?: Address | undefined
}) => {
  if (!fromToken || !toToken) return false
  if (isWrapOrUnwrap({ from: fromToken, to: toToken })) return false

  if (
    sender &&
    isAddressFeeWhitelisted(sender) &&
    (!recipient || isAddressFeeWhitelisted(recipient))
  ) {
    return false
  }

  return true
}

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
  if (!shouldChargeFee({ fromToken, toToken })) {
    return '$0'
  }

  return `${tokenOutPrice ? '$' : ''}${minAmountOut
    .mul(new Percent({ numerator: EVM_UI_FEE_BIPS, denominator: 10_000 }))
    .mul(tokenOutPrice ? tokenOutPrice.asFraction : 1n)
    .toSignificant(4)}${!tokenOutPrice ? ` ${toToken.symbol}` : ''}`
}
