'use client'

import {
  type SushiV4LiquidityChanges,
  type SushiV4Swaps,
  type V4Pool,
  getSushiV4Burns,
  getSushiV4Mints,
  getSushiV4Swaps,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { type FC, useState } from 'react'
import {
  type PoolTransaction,
  PoolTransactionType,
  PoolTransactionsCard,
} from '~evm/[chainId]/pool/_ui/pool-transactions'

type TransactionV4 = PoolTransaction & { pool: V4Pool }

function toTransactionV4(
  pool: V4Pool,
  type: PoolTransactionType,
  transaction: SushiV4Swaps[number] | SushiV4LiquidityChanges[number],
): TransactionV4 {
  return {
    type,
    pool,
    origin: transaction.origin,
    amount0: Number(transaction.amount0),
    amount1: Number(transaction.amount1),
    amountUSD: transaction.amountUSD ?? 0,
    timestamp: transaction.transaction.timestamp,
    logIndex: transaction.logIndex,
    transaction: transaction.transaction,
  }
}

async function fetchTransactionsV4(
  pool: V4Pool,
  type: PoolTransactionType,
): Promise<TransactionV4[]> {
  const variables = { chainId: pool.chainId, poolId: pool.address }

  switch (type) {
    case PoolTransactionType.Mint:
      return (await getSushiV4Mints(variables)).map((mint) =>
        toTransactionV4(pool, type, mint),
      )
    case PoolTransactionType.Burn:
      return (await getSushiV4Burns(variables)).map((burn) =>
        toTransactionV4(pool, type, burn),
      )
    default:
      return (await getSushiV4Swaps(variables)).map((swap) =>
        toTransactionV4(pool, PoolTransactionType.Swap, swap),
      )
  }
}

export const PoolTransactionsV4: FC<{ pool: V4Pool }> = ({ pool }) => {
  const [type, setType] = useState<PoolTransactionType>(
    PoolTransactionType.Swap,
  )

  const { data, isLoading } = useQuery({
    queryKey: ['poolTransactionsV4', pool.chainId, pool.address, type],
    queryFn: () => fetchTransactionsV4(pool, type),
    refetchInterval: 60_000,
  })

  return (
    <PoolTransactionsCard
      type={type}
      onTypeChange={setType}
      data={data}
      isLoading={isLoading}
    />
  )
}
