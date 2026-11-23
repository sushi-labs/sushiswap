'use client'

import {
  getSushiV3Burns,
  getSushiV3Collects,
  getSushiV3Mints,
  getSushiV3Swaps,
} from '@sushiswap/graph-client/data-api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTableVirtual,
  MobileTable,
  Toggle,
  ToggleGroup,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import { type FC, useMemo, useState } from 'react'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import {
  type SushiSwapV3ChainId,
  getEvmChainById,
  isSushiSwapV3ChainId,
} from 'sushi/evm'
import type { Address, Hex } from 'viem'
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
        case TransactionTypeV3.Mint:
          transactions = await fetchMints(poolAddress, pool.chainId)
          break
        case TransactionTypeV3.Burn:
          transactions = await fetchBurns(poolAddress, pool.chainId)
          break
        case TransactionTypeV3.Swap:
          transactions = await fetchSwaps(poolAddress, pool.chainId)
          break
        case TransactionTypeV3.Collect:
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
          type: TransactionTypeV3.Mint as const,
        }))

        const burns = (
          transaction.burns as NonNullable<(typeof transaction.burns)[0]>[]
        ).map((burn) => ({
          ...burn,
          owner: String(burn.owner),
          origin: String(burn.origin),
          type: TransactionTypeV3.Burn as const,
        }))

        const swaps = (
          transaction.swaps as NonNullable<(typeof transaction.swaps)[0]>[]
        ).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          recipient: String(swap.recipient),
          origin: String(swap.origin),
          type: TransactionTypeV3.Swap as const,
        }))

        const collects = (
          transaction.collects as NonNullable<
            (typeof transaction.collects)[0]
          >[]
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

function getTransactionUrl(row: TransactionV3): string {
  return (
    getEvmChainById(row.pool.chainId).getTransactionUrl(
      row.transaction.id as Hex,
    ) ?? ''
  )
}

interface PoolTransactionsV3Props {
  pool: V3Pool | undefined | null
  poolAddress: Address
}

const PoolTransactionsV3: FC<PoolTransactionsV3Props> = ({
  pool,
  poolAddress,
}) => {
  const [type, setType] = useState(TransactionTypeV3.Swap)

  const COLUMNS = useMemo(() => {
    return [
      TX_ORIGIN_V3_COLUMN,
      TX_AMOUNT_IN_V3_COLUMN(type),
      TX_AMOUNT_OUT_V3_COLUMN(type),
      TX_AMOUNT_USD_V3_COLUMN,
      TX_TIME_V3_COLUMN,
    ]
  }, [type])

  const { data, isLoading } = useTransactionsV3(pool, poolAddress, {
    type,
    first: 100,
    refetchInterval: 60_000,
  })

  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  return (
    <Card className="!bg-transparent lg:!bg-secondary !border-transparent lg:!border-accent">
      <CardHeader className="!px-0 !pt-3 lg:!px-6 lg:!pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Transactions</CardTitle>
          <ToggleGroup>
            <Toggle
              size="xs"
              pressed={type === TransactionTypeV3.Swap}
              onClick={() => setType(TransactionTypeV3.Swap)}
            >
              Swaps
            </Toggle>
            <Toggle
              size="xs"
              pressed={type === TransactionTypeV3.Mint}
              onClick={() => setType(TransactionTypeV3.Mint)}
            >
              Add
            </Toggle>
            <Toggle
              size="xs"
              pressed={type === TransactionTypeV3.Burn}
              onClick={() => setType(TransactionTypeV3.Burn)}
            >
              Remove
            </Toggle>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="!px-0">
        <div className="hidden lg:block">
          <DataTableVirtual
            linkFormatter={getTransactionUrl}
            externalLink
            loading={isLoading}
            columns={COLUMNS}
            data={_data}
            scrollMode="window"
            estimateSize={52}
            skeletonRowCount={10}
            state={{
              pagination: { pageIndex: 0, pageSize: Math.max(_data.length, 1) },
            }}
          />
        </div>
        <div className="lg:hidden">
          <MobileTable
            key={type}
            columns={COLUMNS}
            data={_data}
            isLoading={isLoading}
            sorting={[]}
            scrollMode="window"
            isExpandedOverride
            hideExpand
            rowRenderer={(row, card) => (
              <a
                href={getTransactionUrl(row.original)}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue"
              >
                {card}
              </a>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export { PoolTransactionsV3, useTransactionsV3 }
export type { TransactionV3 }
