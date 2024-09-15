import type { Amount } from '../currency/amount.js'
import type { Type } from '../currency/type.js'
import { getBigInt } from '../math/index.js'

export const calculateFee = (amount: bigint | Amount<Type>, fee = 0.0025) =>
  ((typeof amount === 'bigint' ? amount : amount.quotient) *
    getBigInt(fee * 1_000_000)) /
  1_000_000n
