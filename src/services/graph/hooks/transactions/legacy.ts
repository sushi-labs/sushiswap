import { ChainId } from '@sushiswap/core-sdk'
import { Transactions } from 'app/features/transactions/types'
import { formatNumber } from 'app/functions'
import { getTransactions } from 'app/services/graph/fetchers'
import stringify from 'fast-json-stable-stringify'
import { useMemo } from 'react'
import useSWR from 'swr'

export interface LegacyTransactions {
  amount0In: string
  amount0Out: string
  amount1In: string
  amount1Out: string
  amountUSD: string
  id: string
  pair: {
    token0: {
      symbol: string
    }
    token1: {
      symbol: string
    }
  }
  sender: string
  timestamp: string
  to: string
  txHash: string
}

export const legacyTransactionDataFormatter = (rawData: LegacyTransactions[]): Transactions[] => {
  return rawData.map((tx) => {
    const props =
      tx.amount0In === '0'
        ? {
            type: `Swap ${tx.pair.token1.symbol} for ${tx.pair.token0.symbol}`,
            incomingAmt: `${formatNumber(tx.amount1In)} ${tx.pair.token1.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount0Out)} ${tx.pair.token0.symbol}`,
          }
        : {
            type: `Swap ${tx.pair.token0.symbol} for ${tx.pair.token1.symbol}`,
            incomingAmt: `${formatNumber(tx.amount0In)} ${tx.pair.token0.symbol}`,
            outgoingAmt: `${formatNumber(tx.amount1Out)} ${tx.pair.token1.symbol}`,
          }
    return {
      value: formatNumber(tx.amountUSD, true),
      address: tx.to,
      time: tx.timestamp,
      txHash: tx.id,
      ...props,
    }
  })
}
export const useLegacyTransactions = (chainId?: ChainId, pairs?: string[]) => {
  const variables = { where: { pair_in: pairs } }
  const { data, error, isValidating } = useSWR<LegacyTransactions[]>(
    !!chainId && !!pairs ? ['legacyTransactions', chainId, stringify(variables)] : null,
    // @ts-ignore TYPE NEEDS FIXING
    () => getTransactions(chainId, variables)
  )
  const transactions = useMemo(() => legacyTransactionDataFormatter(data || []), [data])
  return { transactions, error, loading: isValidating }
}
