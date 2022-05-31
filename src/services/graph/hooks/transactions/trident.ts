import { Transactions } from 'app/features/transactions/types'
import { formatNumber } from 'app/functions'

export interface Mint {
  id: string
  token0: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  token1: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  amount0: string
  amount1: string
  transaction: {
    id: string
    timestamp: string
  }
  sender: string
  recipient: string
  origin: string
}

export interface Burn {
  id: string
  token0: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  token1: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  amount0: string
  amount1: string
  transaction: {
    id: string
    timestamp: string
  }
  sender: string
  recipient: string
  origin: string
}

export interface Swap {
  id: string
  amountIn: string
  amountOut: string
  // amountUSD: string // - Waiting on subgraph support
  transaction: {
    timestamp: string
    id: string
  }
  recipient: string
  tokenIn: {
    symbol: string
    price: {
      derivedUSD: string
    }
  }
  tokenOut: {
    symbol: string
  }
}

export interface TridentTransactionRawData {
  mints: Mint[]
  burns: Burn[]
  swaps: Swap[]
}

export function tridentTransactionsRawDataFormatter(rawData: TridentTransactionRawData): Transactions[] {
  const swaps = rawData.swaps.map((tx) => ({
    txHash: tx.transaction.id,
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amountIn)} ${tx.tokenIn.symbol}`,
    outgoingAmt: `${formatNumber(tx.amountOut)} ${tx.tokenOut.symbol}`,
    time: tx.transaction.timestamp,
    value: formatNumber(Number(tx.amountIn) * Number(tx.tokenIn.price.derivedUSD), true),
    type: `Swap ${tx.tokenIn.symbol} for ${tx.tokenOut.symbol}`,
  }))
  const mints = rawData.mints.map((tx) => ({
    txHash: tx.transaction.id,
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amount0)} ${tx.token0.symbol}`,
    outgoingAmt: `${formatNumber(tx.amount1)} ${tx.token1.symbol}`,
    time: tx.transaction.timestamp,
    value: formatNumber(
      Number(tx.amount0) * Number(tx.token0.price.derivedUSD) + Number(tx.amount1) * Number(tx.token1.price.derivedUSD),
      true
    ),
    type: `Mint ${tx.token0.symbol} and ${tx.token1.symbol}`,
  }))

  const burns = rawData.burns.map((tx) => ({
    txHash: tx.transaction.id,
    address: tx.recipient,
    incomingAmt: `${formatNumber(tx.amount0)} ${tx.token0.symbol}`,
    outgoingAmt: `${formatNumber(tx.amount1)} ${tx.token1.symbol}`,
    time: tx.transaction.timestamp,
    value: formatNumber(
      Number(tx.amount0) * Number(tx.token0.price.derivedUSD) + Number(tx.amount1) * Number(tx.token1.price.derivedUSD),
      true
    ),
    type: `Burn ${tx.token0.symbol} and ${tx.token1.symbol}`,
  }))

  return [...swaps, ...mints, ...burns]
}
