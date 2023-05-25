import { ChainId } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'
import { SUBGRAPH_HOST, SUSHISWAP_V3_SUBGRAPH_NAME } from '@sushiswap/graph-config'
import { Pool, isV3ChainId } from '@sushiswap/v3-sdk'
import { Query, UseQueryResult, useQuery } from '@tanstack/react-query'

export enum TransactionType {
  Mint = 'Mint',
  Burn = 'Burn',
  Swap = 'Swap',
  Collect = 'Collect',
}

interface UseTransactionsV3Opts {
  refetchInterval?: number
  first: number
  skip?: number
}

// Will only support the last 1k txs
// The fact that there are different subtransactions aggregated under one transaction makes paging a bit difficult
function useTransactionsV3(pool: Pool | undefined | null, poolId: string, opts: UseTransactionsV3Opts) {
  return useQuery({
    queryKey: ['poolTransactionsV3', poolId, opts],
    queryFn: async () => {
      const chainId = pool?.chainId as ChainId

      if (!pool || !isV3ChainId(chainId)) return null

      const sdk = getBuiltGraphSDK({
        subgraphHost: SUBGRAPH_HOST[chainId],
        subgraphName: SUSHISWAP_V3_SUBGRAPH_NAME[chainId],
      })

      const { transactions } = await sdk.V3Transactions({
        first: opts.first,
        skip: opts.skip,
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

      return transactions.flatMap((transaction) => {
        const mints = (transaction.mints as NonNullable<(typeof transaction.mints)[0]>[]).map((mint) => ({
          ...mint,
          owner: String(mint.owner),
          sender: String(mint.sender),
          origin: String(mint.origin),
          type: TransactionType.Mint as const,
        }))

        const burns = (transaction.burns as NonNullable<(typeof transaction.burns)[0]>[]).map((burn) => ({
          ...burn,
          owner: String(burn.owner),
          origin: String(burn.origin),
          type: TransactionType.Burn as const,
        }))

        const swaps = (transaction.swaps as NonNullable<(typeof transaction.swaps)[0]>[]).map((swap) => ({
          ...swap,
          sender: String(swap.sender),
          recipient: String(swap.recipient),
          origin: String(swap.origin),
          type: TransactionType.Swap as const,
        }))

        const collects = (transaction.collects as NonNullable<(typeof transaction.collects)[0]>[]).map((collect) => ({
          ...collect,
          origin: String(collect.owner),
          type: TransactionType.Collect as const,
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
    enabled: !!pool && isV3ChainId(pool?.chainId as ChainId),
    refetchInterval: opts?.refetchInterval,
  })
}

type Transaction = NonNullable<ReturnType<typeof useTransactionsV3>['data']>[0]

export { useTransactionsV3 }
export type { Transaction }
