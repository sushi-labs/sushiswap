'use client'

import {
  getSushiV3Burns,
  getSushiV3Collects,
  getSushiV3Mints,
  getSushiV3Swaps,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { type FC, useMemo, useState } from 'react'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import { type SushiSwapV3ChainId, isSushiSwapV3ChainId } from 'sushi/evm'
import type { Address } from 'viem'
import {
  PoolTransactionType,
  PoolTransactionsCard,
} from '~evm/[chainId]/pool/_ui/pool-transactions'

interface UseTransactionsV3Opts {
  type?: PoolTransactionType | 'All'
  refetchInterval?: number
}

const fetchMints = async (address: Address, chainId: SushiSwapV3ChainId) => {
  const mints = await getSushiV3Mints({
    address,
    chainId,
  })

  return mints.map((mint) => ({
    ...mint.transaction,
    mints: [mint],
    burns: [],
    swaps: [],
    collects: [],
  }))
}

const fetchBurns = async (address: Address, chainId: SushiSwapV3ChainId) => {
  const burns = await getSushiV3Burns({
    chainId,
    address,
  })

  return burns.map((burn) => ({
    ...burn.transaction,
    mints: [],
    burns: [burn],
    swaps: [],
    collects: [],
  }))
}

const fetchSwaps = async (address: Address, chainId: SushiSwapV3ChainId) => {
  const swaps = await getSushiV3Swaps({
    chainId,
    address,
  })

  return swaps.map((swap) => ({
    ...swap.transaction,
    mints: [],
    burns: [],
    swaps: [swap],
    collects: [],
  }))
}

const fetchCollects = async (address: Address, chainId: SushiSwapV3ChainId) => {
  const collects = await getSushiV3Collects({
    chainId,
    address,
  })

  return collects.map((collect) => ({
    ...collect.transaction,
    mints: [],
    burns: [],
    swaps: [],
    collects: [collect],
  }))
}

// Will only support the last 1k txs
// The fact that there are different subtransactions aggregated under one transaction makes paging a bit difficult
function useTransactionsV3(
  pool: V3Pool | undefined | null,
  poolAddress: Address,
  opts: UseTransactionsV3Opts,
) {
  return useQuery({
    queryKey: ['poolTransactionsV3', poolAddress, opts],
    queryFn: async () => {
      if (!pool || !isSushiSwapV3ChainId(pool.chainId)) return []

      let transactions = []

      switch (opts.type) {
        case PoolTransactionType.Mint:
          transactions = await fetchMints(poolAddress, pool.chainId)
          break
        case PoolTransactionType.Burn:
          transactions = await fetchBurns(poolAddress, pool.chainId)
          break
        case PoolTransactionType.Swap:
          transactions = await fetchSwaps(poolAddress, pool.chainId)
          break
        case PoolTransactionType.Collect:
          transactions = await fetchCollects(poolAddress, pool.chainId)
          break
        default:
          transactions = await fetchSwaps(poolAddress, pool.chainId)
      }

      if (!transactions.length) return []

      return transactions.flatMap((transaction) => {
        const mints = (
          transaction.mints as NonNullable<(typeof transaction.mints)[0]>[]
        ).map((mint) => ({
          ...mint,
          owner: String(mint.owner),
          sender: String(mint.sender),
          origin: String(mint.origin),
          type: PoolTransactionType.Mint as const,
        }))

        const burns = (
          transaction.burns as NonNullable<(typeof transaction.burns)[0]>[]
        ).map((burn) => ({
          ...burn,
          owner: String(burn.owner),
          origin: String(burn.origin),
          type: PoolTransactionType.Burn as const,
        }))

        const swaps = (
          transaction.swaps as NonNullable<(typeof transaction.swaps)[0]>[]
        ).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          recipient: String(swap.recipient),
          origin: String(swap.origin),
          type: PoolTransactionType.Swap as const,
        }))

        const collects = (
          transaction.collects as NonNullable<
            (typeof transaction.collects)[0]
          >[]
        ).map((collect) => ({
          ...collect,
          origin: String(collect.owner),
          type: PoolTransactionType.Collect as const,
        }))

        return [...mints, ...burns, ...swaps, ...collects]
          .flatMap((subtransaction) => ({
            pool,
            timestamp: Number(transaction.timestamp),
            blockNumber: Number(transaction.blockNumber),
            ...subtransaction,
            amount0: Number(subtransaction.amount0), // new Amount(pool.token0, subtransaction.amount0),
            amount1: Number(subtransaction.amount1), // new Amount(pool.token1, subtransaction.amount1),
            amountUSD: Number(subtransaction.amountUSD),
            logIndex: Number(subtransaction.logIndex),
          }))
          .sort((a, b) => b.logIndex - a.logIndex)
      })
    },
    enabled: !!pool && isSushiSwapV3ChainId(pool?.chainId),
    refetchInterval: opts?.refetchInterval,
  })
}

type TransactionV3 = NonNullable<
  ReturnType<typeof useTransactionsV3>['data']
>[0]

interface PoolTransactionsV3Props {
  pool: V3Pool | undefined | null
  poolAddress: Address
}

const PoolTransactionsV3: FC<PoolTransactionsV3Props> = ({
  pool,
  poolAddress,
}) => {
  const [type, setType] = useState<PoolTransactionType>(
    PoolTransactionType.Swap,
  )

  const opts = useMemo(
    () => ({ refetchInterval: 60_000, type }) as const,
    [type],
  )

  const { data, isLoading } = useTransactionsV3(pool, poolAddress, opts)

  return (
    <PoolTransactionsCard
      type={type}
      onTypeChange={setType}
      data={data}
      isLoading={isLoading}
    />
  )
}

export { PoolTransactionsV3, useTransactionsV3 }
export type { TransactionV3 }
