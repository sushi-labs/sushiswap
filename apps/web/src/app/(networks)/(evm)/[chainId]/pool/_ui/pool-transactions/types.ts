import type { EvmChainId, EvmCurrency } from 'sushi/evm'

export enum PoolTransactionType {
  Mint = 'Mint',
  Burn = 'Burn',
  Swap = 'Swap',
  Collect = 'Collect',
}

/** The fields the shared pool transactions table renders, for any pool version. */
export interface PoolTransaction {
  type: PoolTransactionType
  /** The transaction's sender; null where the API has not observed it. */
  origin: string | null
  amount0: number
  amount1: number
  amountUSD: number
  timestamp: number
  logIndex: number
  pool: {
    chainId: EvmChainId
    token0: EvmCurrency
    token1: EvmCurrency
  }
  transaction: {
    id: string
  }
}
