'use client'

import { RadioGroup } from '@headlessui/react'
import { Chain, ChainId } from '@sushiswap/chain'
import { Pool } from '@sushiswap/client'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { SUBGRAPH_HOST, SUSHISWAP_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { DataTable } from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { isSushiSwapV2ChainId, SushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { useQuery } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'

import {
  TX_AMOUNT_IN_V2_COLUMN,
  TX_AMOUNT_OUT_V2_COLUMN,
  TX_AMOUNT_USD_V2_COLUMN,
  TX_CREATED_TIME_V2_COLUMN,
  TX_SENDER_V2_COLUMN,
} from './columns'

export enum TransactionType {
  Mint = 'Mint',
  Burn = 'Burn',
  Swap = 'Swap',
}

interface UseTransactionsV2Opts {
  type?: TransactionType | 'All'
  refetchInterval?: number
  first: number
  skip?: number
}

const fetchAll = async (poolId: string, chainId: SushiSwapV2ChainId, opts: UseTransactionsV2Opts) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
  })

  const { transactions } = await sdk.V2Transactions({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      or: [
        {
          mints_: {
            pair: poolId.toLowerCase(),
          },
        },
        {
          burns_: {
            pair: poolId.toLowerCase(),
            amount0_not: null,
            amount1_not: null,
            sender_not: null,
          },
        },
        {
          swaps_: {
            pair: poolId.toLowerCase(),
          },
        },
      ],
    },
  })

  return transactions
}

const fetchMints = async (poolId: string, chainId: SushiSwapV2ChainId, opts: UseTransactionsV2Opts) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
  })

  const { mints } = await sdk.V2Mints({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pair: poolId.toLowerCase() },
  })

  return mints.map((mint) => ({
    ...mint.transaction,
    mints: [mint],
    burns: [],
    swaps: [],
  }))
}

const fetchBurns = async (poolId: string, chainId: SushiSwapV2ChainId, opts: UseTransactionsV2Opts) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
  })

  const { burns } = await sdk.V2Burns({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      pair: poolId.toLowerCase(),
      amount0_not: null,
      amount1_not: null,
      sender_not: null,
    },
  })

  return burns.map((burn) => ({
    ...burn.transaction,
    mints: [],
    burns: [burn],
    swaps: [],
  }))
}

const fetchSwaps = async (poolId: string, chainId: SushiSwapV2ChainId, opts: UseTransactionsV2Opts) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_SUBGRAPH_NAME[chainId],
  })

  const { swaps } = await sdk.V2Swaps({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pair: poolId.toLowerCase() },
  })

  return swaps.map((swap) => ({
    ...swap.transaction,
    mints: [],
    burns: [],
    swaps: [swap],
  }))
}

// Will only support the last 1k txs
// The fact that there are different subtransactions aggregated under one transaction makes paging a bit difficult
function useTransactionsV2(pool: Pool | undefined | null, poolId: string, opts: UseTransactionsV2Opts) {
  return useQuery({
    queryKey: ['poolTransactionsV2', poolId, pool?.chainId, opts],
    queryFn: async () => {
      const chainId = pool?.chainId as ChainId

      if (!pool || !isSushiSwapV2ChainId(chainId)) return []

      let transactions: Awaited<ReturnType<typeof fetchAll>>

      switch (opts.type) {
        case 'All':
          transactions = await fetchAll(poolId, chainId, opts)
          break
        case TransactionType.Mint:
          transactions = await fetchMints(poolId, chainId, opts)
          break
        case TransactionType.Burn:
          transactions = await fetchBurns(poolId, chainId, opts)
          break
        case TransactionType.Swap:
          transactions = await fetchSwaps(poolId, chainId, opts)
          break
        default:
          transactions = await fetchAll(poolId, chainId, opts)
      }

      if (!transactions.length) return []

      return transactions.flatMap((transaction) => {
        const mints = (transaction.mints as NonNullable<(typeof transaction.mints)[0]>[]).map((mint) => ({
          ...mint,
          sender: String(mint.sender),
          amount0: Number(mint.amount0),
          amount1: Number(mint.amount1),
          type: TransactionType.Mint as const,
        }))

        const burns = (transaction.burns as NonNullable<(typeof transaction.burns)[0]>[]).map((burn) => ({
          ...burn,
          sender: String(burn.sender),
          amount0: Number(burn.amount0),
          amount1: Number(burn.amount1),
          type: TransactionType.Burn as const,
        }))

        const swaps = (transaction.swaps as NonNullable<(typeof transaction.swaps)[0]>[]).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          to: String(swap.to),
          amountIn: Number(swap.amountIn),
          amountOut: Number(swap.amountOut),
          type: TransactionType.Swap as const,
        }))

        return [...mints, ...burns, ...swaps]
          .flatMap((subtransaction) => ({
            pool,
            txHash: transaction.id,
            createdAtTimestamp: Number(transaction.createdAtTimestamp),
            createdAtBlock: Number(transaction.createdAtBlock),
            ...subtransaction,
            amountUSD: Number(subtransaction.amountUSD),
            logIndex: Number(subtransaction.logIndex),
          }))
          .sort((a, b) => b.logIndex - a.logIndex)
      })
    },
    enabled: !!pool && isSushiSwapV2ChainId(pool?.chainId as ChainId),
    refetchInterval: opts?.refetchInterval,
  })
}

type Transaction = NonNullable<ReturnType<typeof useTransactionsV2>['data']>[0]

interface PoolTransactionsV2Props {
  pool: Pool | undefined | null
  poolId: string
}

const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({ pool, poolId }) => {
  const [type, setType] = useState<Parameters<typeof useTransactionsV2>['2']['type']>(TransactionType.Swap)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const COLUMNS = useMemo(() => {
    return [
      TX_SENDER_V2_COLUMN,
      TX_AMOUNT_IN_V2_COLUMN(type),
      TX_AMOUNT_OUT_V2_COLUMN(type),
      TX_AMOUNT_USD_V2_COLUMN,
      TX_CREATED_TIME_V2_COLUMN,
    ]
  }, [type])

  const opts = useMemo(
    () =>
      ({
        refetchInterval: 60_000,
        first: paginationState.pageSize === 0 ? paginationState.pageIndex + 1 : 100,
        type,
      } as const),
    [paginationState.pageIndex, paginationState.pageSize, type]
  )

  const { data, isLoading } = useTransactionsV2(pool, poolId, opts)

  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return (
    <div>
      <RadioGroup value={type} onChange={setType} className="flex gap-2 mb-3">
        <RadioGroup.Option value={TransactionType.Swap}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Swaps
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Mint}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Add liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={TransactionType.Burn}>
          {({ checked }) => (
            <Toggle size="xs" pressed={checked}>
              Remove liquidity
            </Toggle>
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <DataTable
        linkFormatter={(row) => Chain.from(row.pool.chainId).getTxUrl(row.txHash)}
        loading={isLoading}
        columns={COLUMNS}
        data={_data}
        pagination={true}
        onPaginationChange={setPaginationState}
        state={{
          pagination: paginationState,
        }}
      />
    </div>
  )
}

export { PoolTransactionsV2, useTransactionsV2 }
export type { Transaction }
