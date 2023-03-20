import { ChainId } from '@sushiswap/chain'
import { createClient } from '@sushiswap/database'

import { PoolType, ProtocolName, ProtocolVersion } from '../../../config.js'
import { NewestPool, SeedConfiguration } from '../../base/index.js'
import { TraderJoeSchema } from '../../base/trader-joe.js'
import { GRAPH_HOST, SPOOKYSWAP_V2_SUBGRAPH_NAME, SPOOKYSWAP_V2_SUPPORTED_CHAINS } from '../config.js'

const LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID: Map<ChainId, NewestPool> = new Map()

export async function spookySwapV2({ dryRun, initialRun }: { dryRun: boolean; initialRun: boolean }) {
  if (initialRun) {
    console.log('SPOOKYSWAP V2: Initial run')
  }
  if (dryRun) {
    console.log('SPOOKYSWAP V2: Dry run')
  }
  const client = await createClient()
  const configs = SPOOKYSWAP_V2_SUPPORTED_CHAINS.map((chainId) => {
    return {
      chainId,
      subgraph: SPOOKYSWAP_V2_SUBGRAPH_NAME[chainId],
      graphHost: GRAPH_HOST[chainId],
      protocol: ProtocolName.SPOOKYSWAP,
      version: ProtocolVersion.V2,
      newestPool: LAST_CREATED_POOL_TIMESTAMP_BY_CHAIN_ID.get(chainId),
      poolConfiguration: {
        type: PoolType.CONSTANT_PRODUCT_POOL,
        swapFee: 0.002,
        twapEnabled: true,
      },
    } as SeedConfiguration
  })

  for (const config of configs) {
    const newestPool = await TraderJoeSchema.run({ client, config, initialRun, dryRun })
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
