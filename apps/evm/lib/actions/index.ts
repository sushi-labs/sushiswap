export * from './approveMasterContractAction'
export * from './approveSLPAction'
export * from './batchAction'
export * from './burnLiquidityAction'
export * from './burnLiquiditySingleAction'
export * from './deployNewPoolAction'
export * from './sweepAction'
export * from './unwrapETHAction'

import { Address } from 'viem'

export type LiquidityInput = {
  token: Address
  native: boolean
  amount: bigint
}
