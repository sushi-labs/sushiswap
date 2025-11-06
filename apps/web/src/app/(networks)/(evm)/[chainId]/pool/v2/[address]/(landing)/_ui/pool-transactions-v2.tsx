'use client'

import {
  type RawV2Pool,
  type V2Pool,
  getSushiV2Burns,
  getSushiV2Mints,
  getSushiV2Swaps,
  hydrateV2Pool,
} from '@sushiswap/graph-client/data-api'
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
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  type SushiSwapV2ChainId,
  getEvmChainById,
  isSushiSwapV2ChainId,
} from 'sushi/evm'
import type { Address } from 'viem'
import { useAccount } from 'wagmi'
import { Wrapper } from '~evm/[chainId]/[trade]/_ui/swap/trade/wrapper'
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

const fetchMints = async (
  address: Address,
  chainId: SushiSwapV2ChainId,
  user: Address | undefined,
) => {
  const mints = await getSushiV2Mints({
    chainId,
    address,
    user,
  })

  return mints.map((mint) => ({
    ...mint.transaction,
    mints: [mint],
    burns: [],
    swaps: [],
  }))
}

const fetchBurns = async (
  address: Address,
  chainId: SushiSwapV2ChainId,
  user: Address | undefined,
) => {
  const burns = await getSushiV2Burns({
    chainId,
    address,
    user,
  })

  return burns.map((burn) => ({
    ...burn.transaction,
    mints: [],
    burns: [burn],
    swaps: [],
  }))
}

const fetchSwaps = async (
  address: Address,
  chainId: SushiSwapV2ChainId,
  user: Address | undefined,
) => {
  const swaps = await getSushiV2Swaps({
    chainId,
    address,
    user,
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
function useTransactionsV2(
  pool: RawV2Pool | V2Pool | undefined | null,
  poolAddress: Address,
  opts: UseTransactionsV2Opts,
  user: Address | undefined,
) {
  return useQuery({
    queryKey: ['poolTransactionsV2', poolAddress, pool?.chainId, opts, user],
    queryFn: async () => {
      if (!pool || !isSushiSwapV2ChainId(pool.chainId)) return []

      let transactions

      switch (opts.type) {
        case TransactionType.Burn:
          transactions = await fetchBurns(poolAddress, pool.chainId, user)
          break
        case TransactionType.Mint:
          transactions = await fetchMints(poolAddress, pool.chainId, user)
          break
        case TransactionType.Swap:
          transactions = await fetchSwaps(poolAddress, pool.chainId, user)
          break
        default:
          transactions = await fetchSwaps(poolAddress, pool.chainId, user)
      }

      if (!transactions.length) return []

      return transactions.flatMap((transaction) => {
        const mints = (
          transaction.mints as NonNullable<(typeof transaction.mints)[0]>[]
        ).map((mint) => ({
          ...mint,
          sender: String(mint.sender),
          amount0: Number(mint.amount0),
          amount1: Number(mint.amount1),
          type: TransactionType.Mint as const,
        }))

        const burns = (
          transaction.burns as NonNullable<(typeof transaction.burns)[0]>[]
        ).map((burn) => ({
          ...burn,
          sender: String(burn.sender),
          amount0: Number(burn.amount0),
          amount1: Number(burn.amount1),
          type: TransactionType.Burn as const,
        }))

        const swaps = (
          transaction.swaps as NonNullable<(typeof transaction.swaps)[0]>[]
        ).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          to: String(swap.to),
          amountIn: Number(
            swap.amount0In !== '0' ? swap.amount0In : swap.amount1In,
          ),
          amountOut: Number(
            swap.amount0Out !== '0' ? swap.amount0Out : swap.amount1Out,
          ),
          type: TransactionType.Swap as const,
        }))

        return [...mints, ...burns, ...swaps]
          .flatMap((subtransaction) => ({
            symbol0: pool.token0.symbol,
            symbol1: pool.token1.symbol,
            chainId: pool.chainId,
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
    enabled: Boolean(pool && isSushiSwapV2ChainId(pool?.chainId)),
    refetchInterval: opts?.refetchInterval,
  })
}

function usePaginatedTransactions(
  pool: V2Pool | undefined | null,
  poolAddress: Address,
  opts: {
    type: TransactionType | 'All' | undefined
    refetchInterval?: number
  },
  address: Address | undefined,
) {
  const PAGE_SIZE = 10

  const {
    data: allTransactions = [],
    isLoading,
    isError,
  } = useTransactionsV2(
    pool,
    poolAddress,
    {
      ...opts,
      first: 100,
    },
    address,
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

type Transaction = NonNullable<ReturnType<typeof useTransactionsV2>['data']>[0]

interface PoolTransactionsV2Props {
  pool: RawV2Pool
  poolAddress: Address
}

const PoolTransactionsV2: FC<PoolTransactionsV2Props> = ({
  pool: rawPool,
  poolAddress,
}) => {
  const pool = useMemo(() => hydrateV2Pool(rawPool), [rawPool])
  const { address } = useAccount()
  const [filterByAddress, setFilterByAddress] = useState(false)
  const [type, setType] = useState<
    Parameters<typeof useTransactionsV2>['2']['type']
  >(TransactionType.Swap)

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
    <Wrapper className="!p-0" enableBorder>
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
                  disabled={!address}
                />
              </span>
            </div>
            <div className="flex gap-1 items-center">
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionType.Swap}
                onClick={() => setType(TransactionType.Swap)}
                className={toggleClass}
              >
                Swaps
              </Toggle>
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionType.Mint}
                onClick={() => setType(TransactionType.Mint)}
                className={toggleClass}
              >
                Add
              </Toggle>
              <Toggle
                variant="trade2"
                size="xs"
                pressed={type === TransactionType.Burn}
                onClick={() => setType(TransactionType.Burn)}
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
              getEvmChainById(row.chainId).getTransactionUrl(
                row.txHash as `0x${string}`,
              ) ?? ''
            }
            loading={isLoading}
            columns={COLUMNS}
            data={_data}
            externalLink
            className="!text-slate-900 dark:!text-[#FFF5FA] !bg-white dark:!bg-slate-800 !px-6 !border-t-0"
          />
        </InfiniteScroll>
      </CardContent>
    </Wrapper>
  )
}

export { PoolTransactionsV2, useTransactionsV2 }
export type { Transaction }
