import { ChainId } from '@sushiswap/chain'
import { BLOCKS_SUBGRAPH_NAME, SUBGRAPH_HOST } from '@sushiswap/graph-client/config'
import { getUnixTime, subDays } from 'date-fns'

interface Block {
  number: number
  timestamp: number
}

const getBlock = async (timestamp: number | undefined = undefined, chainId: ChainId): Promise<Block | undefined> => {
  const { getBuiltGraphSDK } = await import('@sushiswap/graph-client/.graphclient')
  const subgraphName = BLOCKS_SUBGRAPH_NAME[chainId]
  if (!subgraphName) return
  const sdk = getBuiltGraphSDK({ subgraphHost: SUBGRAPH_HOST[chainId], subgraphName: subgraphName })

  let block

  if (timestamp) {
    ;({
      blocks: [block],
    } = await sdk.Blocks({ where: { timestamp_gt: timestamp, timestamp_lt: timestamp + 600 } }))
  } else {
    ;({
      blocks: [block],
    } = await sdk.LatestBlock())
  }

  if (!block) return

  return {
    number: Number(block.number),
    timestamp: Number(block.timestamp),
  }
}

export const getBlockDaysAgo = async (days: number, chainId: ChainId): Promise<Block | undefined> => {
  const timestamp = getUnixTime(subDays(new Date(), days))
  return getBlock(timestamp, chainId)
}

// Avg block time in seconds in the last 24 hours
export const getAverageBlockTime = async (chainId: ChainId): Promise<number | undefined> => {
  const [block, block24h] = await Promise.all([getBlock(undefined, chainId), getBlockDaysAgo(1, chainId)])

  if (!block || !block24h) return

  const blocks = block.number - block24h.number
  const time = block.timestamp - block24h.timestamp

  return time / blocks
}
