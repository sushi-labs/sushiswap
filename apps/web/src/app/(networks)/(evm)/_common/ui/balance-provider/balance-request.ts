import type { Address } from 'viem'

export interface BalanceAccountIdentity {
  account: Address | undefined
  generation: number
}

export function isBalanceResponseCurrent(
  request: BalanceAccountIdentity,
  current: BalanceAccountIdentity,
): boolean {
  return (
    request.account === current.account &&
    request.generation === current.generation
  )
}
