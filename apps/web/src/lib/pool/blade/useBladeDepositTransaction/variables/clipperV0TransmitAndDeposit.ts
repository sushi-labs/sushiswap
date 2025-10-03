import type { DepositVariablesGetterArgs } from '../types'
import { clipperTransmitAndDeposit } from './clipperTransmitAndDeposit'

export function clipperV0TransmitAndDeposit(args: DepositVariablesGetterArgs) {
  const { deposit, amounts } = args
  const hasNativeAmount = amounts.some((amount) => amount.token.isNative)

  if ('amount' in deposit) {
    throw new Error('Single asset deposits are not supported for Clipper V0')
  }

  if (hasNativeAmount) {
    throw new Error('Native amount deposits are not supported for Clipper V0')
  }

  return clipperTransmitAndDeposit(args)
}
