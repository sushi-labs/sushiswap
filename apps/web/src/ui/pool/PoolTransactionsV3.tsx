'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Loader,
  Switch,
  Toggle,
} from '@sushiswap/ui'
import { useQuery } from '@tanstack/react-query'
import type { TableState } from '@tanstack/react-table'
import { type FC, useCallback, useMemo, useState } from 'react'
import { EvmChain, type EvmChainId } from 'sushi/chain'
import { type SushiSwapV3ChainId, isSushiSwapV3ChainId } from 'sushi/config'

import {
  getSushiV3Burns,
  getSushiV3Collects,
  getSushiV3Mints,
  getSushiV3Swaps,
} from '@sushiswap/graph-client/data-api'

import type { V3Pool } from '@sushiswap/graph-client/data-api'
import InfiniteScroll from 'react-infinite-scroll-component'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
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

const fetchMints = async (
  address: Address,
  chainId: SushiSwapV3ChainId,
  user?: Address,
) => {
  const mints = await getSushiV3Mints({
    address,
    chainId,
    user,
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
  address: Address,
  chainId: SushiSwapV3ChainId,
  user?: Address,
) => {
  const burns = await getSushiV3Burns({
    chainId,
    address,
    user,
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
  address: Address,
  chainId: SushiSwapV3ChainId,
  user?: Address,
) => {
  const swaps = await getSushiV3Swaps({
    chainId,
    address,
    user,
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
  user?: Address,
) {
  return useQuery({
    queryKey: ['poolTransactionsV3', poolAddress, opts, user],
    queryFn: async () => {
      const chainId = pool?.chainId as EvmChainId

      if (!pool || !isSushiSwapV3ChainId(chainId)) return []

      let transactions = []

      switch (opts.type) {
        case TransactionTypeV3.Mint:
          transactions = await fetchMints(poolAddress, chainId, user)
          break
        case TransactionTypeV3.Burn:
          transactions = await fetchBurns(poolAddress, chainId, user)
          break
        case TransactionTypeV3.Swap:
          transactions = await fetchSwaps(poolAddress, chainId, user)
          break
        case TransactionTypeV3.Collect:
          transactions = await fetchCollects(poolAddress, chainId)
          break
        default:
          transactions = await fetchSwaps(poolAddress, chainId, user)
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
            amount0: Number(subtransaction.amount0), // Amount.fromRawAmount(pool.token0, subtransaction.amount0),
            amount1: Number(subtransaction.amount1), // Amount.fromRawAmount(pool.token1, subtransaction.amount1),
            amountUSD: Number(subtransaction.amountUSD),
            logIndex: Number(subtransaction.logIndex),
          }))
          .sort((a, b) => b.logIndex - a.logIndex)
      })
    },
    enabled: !!pool && isSushiSwapV3ChainId(pool?.chainId as EvmChainId),
    refetchInterval: opts?.refetchInterval,
  })
}

function usePaginatedTransactions(
  pool: V3Pool | undefined | null,
  poolAddress: Address,
  opts: {
    type: TransactionTypeV3 | 'All' | undefined
    refetchInterval?: number
  },
  user?: Address,
) {
  const PAGE_SIZE = 10

  const {
    data: allTransactions = [],
    isLoading,
    isError,
  } = useTransactionsV3(
    pool,
    poolAddress,
    {
      ...opts,
      first: 100,
    },
    user,
  )

  const [page, setPage] = useState(1)

  const paginatedData = useMemo(() => {
    return allTransactions.slice(0, page * PAGE_SIZE)
  }, [allTransactions, page])

  const hasNextPage = paginatedData.length < allTransactions.length

  const fetchNextPage = useCallback(() => {
    if (hasNextPage) {
      setTimeout(() => {
        setPage((prev) => prev + 1)
      }, 500)
    }
  }, [hasNextPage])

  return {
    data: paginatedData,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    resetPagination: () => setPage(1),
  }
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
  const { address } = useAccount()
  const [filterByAddress, setFilterByAddress] = useState(false)
  const [type, setType] = useState<
    Parameters<typeof useTransactionsV3>['2']['type']
  >(TransactionTypeV3.Swap)

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
        type,
      }) as const,
    [type],
  )

  const { data, isLoading, fetchNextPage, hasNextPage } =
    usePaginatedTransactions(
      pool,
      poolAddress,
      opts,
      filterByAddress ? address : undefined,
    )

  const _data = useMemo(() => {
    return data ?? []
  }, [data])

  const state: Partial<TableState> = useMemo(() => {
    return {
      pagination: {
        pageIndex: 0,
        pageSize: _data.length,
      },
    }
  }, [_data.length])

  const toggleClass =
    'data-[state=on]:!border-blue data-[state=on]:!bg-[#4217FF14] dark:data-[state=on]:!bg-[#3DB1FF14] dark:data-[state=on]:!border-skyblue border border-accent'
  return (
    <Card className="dark:!bg-[#15152B] !bg-slate-50">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-col gap-y-4 justify-between md:flex-row">
            <div className="flex gap-5 justify-between items-center md:justify-start">
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Transactions
              </span>
              <span className="flex gap-2 items-center text-muted-foreground">
                Filter By Your Address
                <Switch
                  checked={filterByAddress}
                  onCheckedChange={setFilterByAddress}
                />
              </span>
            </div>{' '}
            <div className="flex gap-1 items-center">
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionTypeV3.Swap}
                onClick={() => setType(TransactionTypeV3.Swap)}
                className={toggleClass}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionTypeV3.Mint}
                onClick={() => setType(TransactionTypeV3.Mint)}
                className={toggleClass}
              >
                Add
              </Toggle>
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionTypeV3.Burn}
                onClick={() => setType(TransactionTypeV3.Burn)}
                className={toggleClass}
              >
                Remove
              </Toggle>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="!px-0">
        <InfiniteScroll
          dataLength={_data.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center py-4 w-full">
              <Loader size={16} />
            </div>
          }
        >
          <DataTable
            state={state}
            linkFormatter={(row) =>
              EvmChain.from(row.pool.chainId)?.getTxUrl(row.transaction.id) ??
              ''
            }
            loading={isLoading}
            columns={COLUMNS}
            data={_data}
            externalLink={true}
            className="!text-slate-900 dark:!text-[#FFF5FA] !px-6 !border-t-0"
          />
        </InfiniteScroll>
      </CardContent>
    </Card>
  )
}

export { PoolTransactionsV3, useTransactionsV3 }
export type { TransactionV3 }
