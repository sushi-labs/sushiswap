import { useQuery } from '@tanstack/react-query'
import { type } from 'os'
import { Pool } from 'utils/usePools'

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

const fetchAll = async (poolId: string, opts: UseTransactionsV2Opts) => {
  const sdk = {}
  const { transactions } = await sdk.V2Transactions({
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      or: [
        {
          mints_: {},
        },
        {
          burns_: {},
        },
        {
          swaps_: {},
        },
      ],
    },
  })
  return transactions
}

const fetchMints = async (poolId: string, opts: UseTransactionsV2Opts) => {
  const sdk = {}

  const { mints } = await {}

  return mints.map((mint) => ({
    ...mint.transaction,
    mints: [mint],
    burns: [],
    swaps: [],
  }))
}

const fetchBurns = async (poolId: string, opts: UseTransactionsV2Opts) => {
  const sdk = {}

  const { burns } = await {
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      pair: poolId.toLowerCase(),
    },
  }
  return burns.map((burn) => ({
    ...burn.transaction,
    mints: [],
    burns: [burn],
    swaps: [],
  }))
}

const fetchSwaps = async (poolId: string, opts: UseTransactionsV2Opts) => {
  const sdk = {}
  const { swaps } = await {
    first: opts.first,
    skip: opts?.skip ?? 0,
    where: {
      pair: poolId.toLowerCase(),
    },
  }

  return swaps.map((swap) => ({
    ...swap.transaction,
    mints: [],
    burns: [],
    swaps: [swap],
  }))
}

function useTransactionsV2(pool: Pool | undefined | null, poolId: string, opts: UseTransactionsV2Opts) {
  return useQuery({
    queryKey: ['poolTransactionsV2', poolId, opts],
    queryFn: async () => {
      let transactions: Awaited<ReturnType<typeof fetchAll>> = []

      switch (opts.type) {
        case 'All':
          transactions = await fetchAll(poolId, opts)
          break
        case TransactionType.Mint:
          transactions = await fetchMints(poolId, opts)
          break
        case TransactionType.Burn:
          transactions = await fetchBurns(poolId, opts)
          break
        case TransactionType.Swap:
          transactions = await fetchSwaps(poolId, opts)
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
            logIndex: Number(subtransaction.logIndex),
          }))
          .sort((a, b) => b.logIndex - a.logIndex)
      })
    },
    refetchInterval: opts?.refetchInterval,
  })
}

type Transaction = NonNullable<ReturnType<typeof useTransactionsV2>[]>[0]

export { useTransactionsV2 }
export type { Transaction }
