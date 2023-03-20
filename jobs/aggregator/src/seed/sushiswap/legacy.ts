import { ChainId } from '@sushiswap/chain'
import { createClient } from '@sushiswap/database'
import { SUBGRAPH_HOST, SUSHISWAP_ENABLED_NETWORKS } from '@sushiswap/graph-config'

import { ProtocolName, ProtocolVersion } from '../../config.js'
import { NewestPool, SeedConfiguration } from '../base/index.js'
import { SushiSwapSchema } from '../base/sushi.js'
import { LEGACY_SUBGRAPH_NAME } from './config.js'

const LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID: Map<ChainId, NewestPool> = new Map()

export async function sushiSwapLegacy({ dryRun, initialRun }: { dryRun: boolean; initialRun: boolean }) {
  if (initialRun) {
    console.log('SUSHISWAP LEGACY: Initial run')
  }
  if (dryRun) {
    console.log('SUSHISWAP LEGACY: Dry run')
  }
  const client = await createClient()
  const configs = SUSHISWAP_ENABLED_NETWORKS.map((chainId) => {
    return {
      chainId,
      subgraph: LEGACY_SUBGRAPH_NAME[chainId],
      graphHost: SUBGRAPH_HOST[chainId],
      protocol: ProtocolName.SUSHISWAP,
      version: ProtocolVersion.LEGACY,
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
