import type { VariablesOf } from 'gql.tada'
import type { Hex } from 'src/lib/types/hex'
import { type SushiSwapV2ChainId, publicClientConfig } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'
import { createPublicClient, erc20Abi } from 'viem'

import { FetchError } from 'src/lib/fetch-error'
import { addChainId } from 'src/lib/modifiers/add-chain-id'
import { convertIdToMultichainId } from 'src/lib/modifiers/convert-id-to-multichain-id'
import { copyIdToAddress } from 'src/lib/modifiers/copy-id-to-address'
import { requestPaged } from 'src/lib/request-paged'
import type { ChainIdVariable } from 'src/lib/types/chainId'
import { graphql } from '../graphql'

export const SushiV2LiquidityPositionsQuery = graphql(`
  query LiquidityPositions($first: Int = 1000, $skip: Int = 0, $block: Block_height, $orderBy: LiquidityPosition_orderBy, $orderDirection: OrderDirection, $where: LiquidityPosition_filter) {
    liquidityPositions(first: $first, skip: $skip, block: $block, orderBy: $orderBy, orderDirection: $orderDirection, where: $where) {
      id
      balance: liquidityTokenBalance
      pair {
        id
      }
      user {
        id
      }
    }
  }
`)

export type GetSushiV2LiquidityPositions = VariablesOf<
  typeof SushiV2LiquidityPositionsQuery
> &
  ChainIdVariable<SushiSwapV2ChainId>

export async function getSushiV2LiquidityPositions({
  chainId,
  ...variables
}: GetSushiV2LiquidityPositions) {
  try {
    const url = `https://${SUSHISWAP_V2_SUBGRAPH_URL[chainId]}`

    const result = await requestPaged({
      chainId,
      url,
      query: SushiV2LiquidityPositionsQuery,
      variables,
    })

    const transformed = result.liquidityPositions.map((position) => {
      const pool = convertIdToMultichainId(
        copyIdToAddress(addChainId(chainId, position.pair)),
      )

      return {
        id: position.id,
        balance: position.balance,
        pool,
        user: position.user.id as Hex,
      }
    })

    const client = createPublicClient(publicClientConfig[chainId])
    const balances = await client.multicall({
      contracts: transformed.map(
        (pos) =>
          ({
            abi: erc20Abi,
            functionName: 'balanceOf',
            address: pos.pool.address,
            args: [pos.user],
          }) as const,
      ),
      allowFailure: false,
    })

    transformed.forEach((pos, i) => {
      pos.balance = String(balances[i]!)
    })

    return transformed
  } catch {
    throw new FetchError(chainId, 'Failed to fetch liquidity positions')
  }
}

export type SushiV2LiquidityPositions = Awaited<
  ReturnType<typeof getSushiV2LiquidityPositions>
>
