'use client'

import {
  type BladePool,
  getBladeMints,
  getBladeSwaps,
} from '@sushiswap/graph-client/data-api'
import { getBladeBurns } from '@sushiswap/graph-client/data-api'
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
import type { ColumnDef, TableState } from '@tanstack/react-table'
import { type FC, useCallback, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { EvmChain } from 'sushi/chain'
import { isBladeChainId } from 'sushi/config'
import type { Address } from 'viem'
import { formatUnits } from 'viem'
import {
  TX_AMOUNT_IN_V2_COLUMN,
  TX_AMOUNT_OUT_V2_COLUMN,
  TX_AMOUNT_USD_V2_COLUMN,
  TX_CREATED_TIME_V2_COLUMN,
  TX_FEE_BLADE_COLUMN,
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

// const fetchMints = async (address: Address, chainId: BladeChainId) => {
//   const mints = await getBladeMints({
//     chainId,
//     address,
//   })

//   return mints.map((mint) => ({
//     ...mint,
//     mints: [mint],
//     burns: [],
//     swaps: [],
//   }))
// }

// const fetchBurns = async (address: Address, chainId: BladeChainId) => {
//   const burns = await getBladeBurns({
//     chainId,
//     address,
//   })

//   return burns.map((burn) => ({
//     ...burn,
//     mints: [],
//     burns: [burn],
//     swaps: [],
//   }))
// }

// const fetchSwaps = async (address: Address, chainId: BladeChainId) => {
//   const swaps = await getBladeSwaps({
//     chainId,
//     address,
//   })

//   return swaps.map((swap) => ({
//     ...swap,
//     mints: [],
//     burns: [],
//     swaps: [swap],
//   }))
// }

export type TransactionBlade = {
  chainId: number
  txHash: string
  createdAtTimestamp: number
  amountInUSD?: number
  amountOutUSD?: number
  amount0In?: string
  amount0Out?: string
  amount1In?: string
  amount1Out?: string
  amountUSD?: number
  feeUSD?: number
  symbol0: string
  symbol1: string
  type: TransactionType
  sender: string
}

// Will only support the last 1k txs
// The fact that there are different subtransactions aggregated under one transaction makes paging a bit difficult
function useTransactionsBlade(
  pool: BladePool | undefined | null,
  poolAddress: Address,
  opts: UseTransactionsV2Opts,
) {
  return useQuery({
    queryKey: ['poolTransactionsBlade', poolAddress, pool?.chainId, opts],
    enabled: !!pool && isBladeChainId(pool?.chainId),
    refetchInterval: opts?.refetchInterval,
    queryFn: async () => {
      const chainId = pool?.chainId
      if (!pool || !chainId || !isBladeChainId(chainId)) return []

      switch (opts.type) {
        case TransactionType.Burn: {
          const burns = await getBladeBurns({ address: poolAddress, chainId })
          return burns.map(
            (burn): TransactionBlade => ({
              chainId,
              txHash: burn.txHash,
              createdAtTimestamp: burn.timestamp,
              amountUSD: burn.amountUSD,
              symbol0: pool.tokens[0].symbol,
              symbol1: pool.tokens[1].symbol,
              type: TransactionType.Burn,
              sender: burn.user,
            }),
          )
        }

        case TransactionType.Mint: {
          const mints = await getBladeMints({ address: poolAddress, chainId })
          return mints.map(
            (mint): TransactionBlade => ({
              chainId,
              txHash: mint.txHash,
              createdAtTimestamp: mint.timestamp,
              amountUSD: mint.amountUSD,
              symbol0: pool.tokens[0].symbol,
              symbol1: pool.tokens[1].symbol,
              type: TransactionType.Mint,
              sender: mint.user,
            }),
          )
        }

        default: {
          const swaps = await getBladeSwaps({ address: poolAddress, chainId })
          return swaps.map((swap): TransactionBlade => {
            return {
              chainId,
              txHash: swap.txHash,
              createdAtTimestamp: swap.timestamp,
              amount0In: formatUnits(
                BigInt(swap.amountInRaw),
                swap.inToken.decimals,
              ),
              amount1Out: formatUnits(
                BigInt(swap.amountOutRaw),
                swap.outToken.decimals,
              ),
              amount0Out: '0',
              amount1In: '0',
              amountUSD: swap.amountOutUSD,
              symbol0: swap.inToken.symbol,
              symbol1: swap.outToken.symbol,
              type: TransactionType.Swap,
              feeUSD: swap.feeUSD,
              sender: swap.user,
            }
          })
        }
      }
    },
  })
}

function usePaginatedTransactions(
  pool: BladePool | undefined | null,
  poolAddress: Address,
  opts: {
    type: TransactionType | 'All' | undefined
    refetchInterval?: number
  },
) {
  const PAGE_SIZE = 10

  const {
    data: allTransactions = [],
    isLoading,
    isError,
  } = useTransactionsBlade(pool, poolAddress, {
    ...opts,
    first: 100,
  })

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

type Transaction = NonNullable<
  ReturnType<typeof useTransactionsBlade>['data']
>[0]

interface PoolTransactionsBladeProps {
  pool: BladePool | undefined | null
  poolAddress: Address
}

const PoolTransactionsBlade: FC<PoolTransactionsBladeProps> = ({
  pool,
  poolAddress,
}) => {
  const [type, setType] = useState<
    Parameters<typeof useTransactionsBlade>['2']['type']
  >(TransactionType.Swap)

  const COLUMNS = useMemo(() => {
    return [
      TX_SENDER_V2_COLUMN,
      type === TransactionType.Swap ? TX_AMOUNT_IN_V2_COLUMN(type) : undefined,
      type === TransactionType.Swap ? TX_AMOUNT_OUT_V2_COLUMN(type) : undefined,
      TX_AMOUNT_USD_V2_COLUMN,
      type === TransactionType.Swap ? TX_FEE_BLADE_COLUMN : undefined,
      TX_CREATED_TIME_V2_COLUMN,
    ].filter(Boolean) as ColumnDef<TransactionBlade, unknown>[]
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
    usePaginatedTransactions(pool, poolAddress, opts)

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
                <Switch />
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
              EvmChain.from(row.chainId)?.getTxUrl(row.txHash) ?? ''
            }
            loading={isLoading}
            columns={COLUMNS}
            data={_data}
            externalLink
            className="!text-slate-900 dark:!text-[#FFF5FA] !px-6 !border-t-0"
          />
        </InfiniteScroll>
      </CardContent>
    </Card>
  )
}

export { PoolTransactionsBlade, useTransactionsBlade }
export type { Transaction }
