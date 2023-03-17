import { ChainId } from '@sushiswap/chain'
import { createClient } from '@sushiswap/database'
import { SUBGRAPH_HOST, TRIDENT_ENABLED_NETWORKS, TRIDENT_SUBGRAPH_NAME } from '@sushiswap/graph-config'

import { ProtocolName, ProtocolVersion } from '../../config.js'
import { NewestPool, SeedConfiguration } from '../protocol/index.js'
import { SushiSwapSchema } from '../protocol/sushi.js'

const LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID: Map<ChainId, NewestPool> = new Map()

export async function sushiSwapTrident({ dryRun, initialRun }: { dryRun: boolean; initialRun: boolean }) {
  if (initialRun) {
    console.log('SUSHISWAP TRIDENT: Initial run')
  }
  if (dryRun) {
    console.log('SUSHISWAP TRIDENT: Dry run')
  }
  const client = await createClient()
  const configs = TRIDENT_ENABLED_NETWORKS.map((chainId) => {
    return {
      chainId,
      subgraph: TRIDENT_SUBGRAPH_NAME[chainId],
      graphHost: SUBGRAPH_HOST[chainId],
      protocol: ProtocolName.SUSHISWAP,
      version: ProtocolVersion.TRIDENT,
      newestPool: LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(chainId),
    } as SeedConfiguration
  })

  for (const config of configs) {
    const newestPool = await SushiSwapSchema.run({ client, config, initialRun, dryRun })
    const before = LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(config.chainId)
    if (newestPool) {
      LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.set(config.chainId, newestPool)
    }
    const after = LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(config.chainId)

    console.log(
      `${config.protocol} ${config.version}: ${config.chainId} - LATEST POOL INFO, BEFORE: ` +
        `${before?.address}/${before?.timestamp} ->  ${after?.address}/${after?.timestamp}`
    )
  }
}
