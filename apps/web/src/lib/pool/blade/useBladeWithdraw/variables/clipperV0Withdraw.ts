import type { WithdrawVariablesGetterArgs } from '../types'
import { clipperWithdraw } from './clipperWithdraw'

export function clipperV0Withdraw(args: WithdrawVariablesGetterArgs) {
  if (args.withdraw && args.token) {
    throw new Error('Single asset withdrawals are not supported for Clipper V0')
  }

  return clipperWithdraw(args)
}
