import { SushiSwapV2ChainId } from 'sushi/config'
import type { Farm } from '../types.js'
import { divBigIntToNumber } from './utils.js'
import { getSushiV2Pools } from '@sushiswap/graph-client-new/sushi-v2'
import { Address } from 'viem'

interface Pair {
  id: string
  totalSupply: number
  liquidityUSD: number
  type: Farm['poolType']
}

async function getExchangePairs(
  ids: string[],
  chainId: SushiSwapV2ChainId,
): Promise<Pair[]> {
  const pairs = await getSushiV2Pools(
    {
      chainId,
      first: ids.length,
      where: { id_in: ids.map((id) => id.toLowerCase() as Address) },
    },
    { retries: 3 },
  )
  return pairs.map((pair) => {
    return {
      id: pair.address.toLowerCase(),
      totalSupply: divBigIntToNumber(BigInt(pair.liquidity), 18),
      liquidityUSD: pair.liquidityUSD,
      type: 'Legacy',
    }
  })
}

export async function getPairs(ids: string[], chainId: SushiSwapV2ChainId) {
  return await getExchangePairs(ids, chainId)
}
