import { SushiSwapV2ChainId } from 'sushi/config'
import { SUSHISWAP_V2_SUBGRAPH_URL } from 'sushi/config/subgraph'
import type { Farm } from '../types.js'
import { divBigIntToNumber } from './utils.js'

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
  const { getBuiltGraphSDK } = await import('../../../.graphclient/index.js')
  const url = SUSHISWAP_V2_SUBGRAPH_URL[chainId]
  if (!url) return []
  const sdk = getBuiltGraphSDK({
    url,
  })

  const { pairs, bundle } = await sdk.Pairs({
    first: ids.length,
    where: { id_in: ids.map((id) => id.toLowerCase()) },
  })

  return pairs.map((pair) => {
    const liquidityUSD = pair.liquidityUSD * bundle?.ethPrice

    return {
      id: pair.id,
      totalSupply: divBigIntToNumber(BigInt(pair.liquidity), 18),
      liquidityUSD: liquidityUSD,
      type: 'Legacy',
    }
  })
}

export async function getPairs(ids: string[], chainId: SushiSwapV2ChainId) {
  return await getExchangePairs(ids, chainId)
}
