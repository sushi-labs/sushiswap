'use client'

import { Pool } from '@sushiswap/client'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import {
  SUBGRAPH_HOST,
  SUSHISWAP_V3_SUBGRAPH_NAME,
} from '@sushiswap/graph-config'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
} from '@sushiswap/ui'
import { Toggle } from '@sushiswap/ui/components/toggle'
import { SushiSwapV3ChainId, isSushiSwapV3ChainId } from 'sushi'
import { useQuery } from '@tanstack/react-query'
import { PaginationState } from '@tanstack/react-table'
import React, { FC, useMemo, useState } from 'react'
import { Chain, ChainId } from 'sushi/chain'

import {
  TX_AMOUNT_IN_V3_COLUMN,
  TX_AMOUNT_OUT_V3_COLUMN,
  TX_AMOUNT_USD_V3_COLUMN,
  TX_ORIGIN_V3_COLUMN,
  TX_TIME_V3_COLUMN,
} from './columns'

export enum TransactionTypeV3 {
  Mint = 'Mint',
  Burn = 'Burn',
  Swap = 'Swap',
  Collect = 'Collect',
}

interface UseTransactionsV3Opts {
  type?: TransactionTypeV3 | 'All'
  refetchInterval?: number
  first: number
  skip?: number
}

const fetchAll = async (
  poolId: string,
  chainId: SushiSwapV3ChainId,
  opts: UseTransactionsV3Opts,
) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
  })

  const { transactions } = await sdk.V3Transactions({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      or: [
        {
          mints_: {
            pool: poolId.toLowerCase(),
          },
        },
        {
          burns_: {
            pool: poolId.toLowerCase(),
          },
        },
        {
          swaps_: {
            pool: poolId.toLowerCase(),
          },
        },
        {
          collects_: {
            pool: poolId.toLowerCase(),
          },
        },
      ],
    },
  })

  return transactions
}

const fetchMints = async (
  poolId: string,
  chainId: SushiSwapV3ChainId,
  opts: UseTransactionsV3Opts,
) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
  })

  const { mints } = await sdk.V3Mints({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pool: poolId.toLowerCase() },
  })

  return mints.map((mint) => ({
    ...mint.transaction,
    mints: [mint],
    burns: [],
    swaps: [],
    collects: [],
  }))
}

const fetchBurns = async (
  poolId: string,
  chainId: SushiSwapV3ChainId,
  opts: UseTransactionsV3Opts,
) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
  })

  const { burns } = await sdk.V3Burns({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pool: poolId.toLowerCase() },
  })

  return burns.map((burn) => ({
    ...burn.transaction,
    mints: [],
    burns: [burn],
    swaps: [],
    collects: [],
  }))
}

const fetchSwaps = async (
  poolId: string,
  chainId: SushiSwapV3ChainId,
  opts: UseTransactionsV3Opts,
) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
  })

  const { swaps } = await sdk.V3Swaps({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pool: poolId.toLowerCase() },
  })

  return swaps.map((swap) => ({
    ...swap.transaction,
    mints: [],
    burns: [],
    swaps: [swap],
    collects: [],
  }))
}

const fetchCollects = async (
  poolId: string,
  chainId: SushiSwapV3ChainId,
  opts: UseTransactionsV3Opts,
) => {
  const sdk = getBuiltGraphSDK({
    subgraphHost: SUBGRAPH_HOST[chainId],
    subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
  })

  const { collects } = await sdk.V3Collects({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: { pool: poolId.toLowerCase() },
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
  pool: Pool | undefined | null,
  poolId: string,
  opts: UseTransactionsV3Opts,
) {
  return useQuery({
    queryKey: ['poolTransactionsV3', poolId, opts],
    queryFn: async () => {
      const chainId = pool?.chainId as ChainId

      if (!pool || !isSushiSwapV3ChainId(chainId)) return []

      let transactions: Awaited<ReturnType<typeof fetchAll>> = []

      switch (opts.type) {
        case 'All':
          transactions = await fetchAll(poolId, chainId, opts)
          break
        case TransactionTypeV3.Mint:
          transactions = await fetchMints(poolId, chainId, opts)
          break
        case TransactionTypeV3.Burn:
          transactions = await fetchBurns(poolId, chainId, opts)
          break
        case TransactionTypeV3.Swap:
          transactions = await fetchSwaps(poolId, chainId, opts)
          break
        case TransactionTypeV3.Collect:
          transactions = await fetchCollects(poolId, chainId, opts)
          break
        default:
          transactions = await fetchAll(poolId, chainId, opts)
      }

      if (!transactions.length) return []

      return transactions.flatMap((transaction) => {
        const mints = (
          transaction.mints as NonNullable<typeof transaction.mints[0]>[]
        ).map((mint) => ({
          ...mint,
          owner: String(mint.owner),
          sender: String(mint.sender),
          origin: String(mint.origin),
          type: TransactionTypeV3.Mint as const,
        }))

        const burns = (
          transaction.burns as NonNullable<typeof transaction.burns[0]>[]
        ).map((burn) => ({
          ...burn,
          owner: String(burn.owner),
          origin: String(burn.origin),
          type: TransactionTypeV3.Burn as const,
        }))

        const swaps = (
          transaction.swaps as NonNullable<typeof transaction.swaps[0]>[]
        ).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          recipient: String(swap.recipient),
          origin: String(swap.origin),
          type: TransactionTypeV3.Swap as const,
        }))

        const collects = (
          transaction.collects as NonNullable<typeof transaction.collects[0]>[]
        ).map((collect) => ({
          ...collect,
          origin: String(collect.owner),
          type: TransactionTypeV3.Collect as const,
        }))

        return [...mints, ...burns, ...swaps, ...collects]
          .flatMap((subtransaction) => ({
            pool,
            timestamp: Number(transaction.timestamp),
            blockNumber: Number(transaction.blockNumber),
            ...subtransaction,
            amount0: Number(subtransaction.amount0), // Amount.fromRawAmount(pool.token0, subtransaction.amount0),
            amount1: Number(subtransaction.amount1), // Amount.fromRawAmount(pool.token1, subtransaction.amount1),
            amountUSD: Number(subtransaction.amountUSD),
            logIndex: Number(subtransaction.logIndex),
          }))
          .sort((a, b) => b.logIndex - a.logIndex)
      })
    },
    enabled: !!pool && isSushiSwapV3ChainId(pool?.chainId as ChainId),
    refetchInterval: opts?.refetchInterval,
  })
}

type TransactionV3 = NonNullable<
  ReturnType<typeof useTransactionsV3>['data']
>[0]

interface PoolTransactionsV3Props {
  pool: Pool | undefined | null
  poolId: string
}

const PoolTransactionsV3: FC<PoolTransactionsV3Props> = ({ pool, poolId }) => {
  const [type, setType] = useState<
    Parameters<typeof useTransactionsV3>['2']['type']
  >(TransactionTypeV3.Swap)
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const COLUMNS = useMemo(() => {
    return [
      TX_ORIGIN_V3_COLUMN,
      TX_AMOUNT_IN_V3_COLUMN(type),
      TX_AMOUNT_OUT_V3_COLUMN(type),
      TX_AMOUNT_USD_V3_COLUMN,
      TX_TIME_V3_COLUMN,
    ]
  }, [type])

  const opts = useMemo(
    () =>
      ({
        refetchInterval: 60_000,
        first:
          paginationState.pageSize === 0 ? paginationState.pageIndex + 1 : 100,
        type,
      }) as const,
    [paginationState.pageIndex, paginationState.pageSize, type],
  )

  const { data, isLoading } = useTransactionsV3(pool, poolId, opts)

  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col md:flex-row justify-between gap-y-4">
            Transactions
            <div className="flex items-center gap-1">
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionTypeV3.Swap}
                onClick={() => setType(TransactionTypeV3.Swap)}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionTypeV3.Mint}
                onClick={() => setType(TransactionTypeV3.Mint)}
              >
                Add
              </Toggle>
              <Toggle
                variant="outline"
                size="xs"
                pressed={type === TransactionTypeV3.Burn}
                onClick={() => setType(TransactionTypeV3.Burn)}
              >
                Remove
              </Toggle>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <DataTable
          linkFormatter={(row) =>
            Chain.from(row.pool.chainId)?.getTxUrl(row.id) ?? ''
          }
          loading={isLoading}
          columns={COLUMNS}
          data={_data}
          pagination={true}
          externalLink={true}
          onPaginationChange={setPaginationState}
          state={{
            pagination: paginationState,
          }}
        />
      </CardContent>
    </Card>
  )
}

export { PoolTransactionsV3, useTransactionsV3 }
export type { TransactionV3 }
