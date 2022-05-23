import { parseUnits } from '@ethersproject/units'
import { Amount, Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'

export const parseAmount = (token: Token, amount: string | undefined) => {
  return Amount.fromRawAmount(
    token,
    JSBI.BigInt(parseUnits(amount && Number(amount) > 0 ? amount : '0', token.decimals)).toString(),
  )
}
