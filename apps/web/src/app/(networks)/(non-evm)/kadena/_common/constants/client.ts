import { createClient } from '@kadena/client'
import {
  type KinesisClientConfig,
  createKinesisClient,
} from '@kinesis-bridge/kinesis-sdk'
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID } from './network'

export const kadenaClient = createClient(
  // `https://api.chainweb.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`,
  `https://kadena-public.runtime-rpc.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`,
)

const config: KinesisClientConfig = {
  kadenaRpcUrl: `https://kadena-public.runtime-rpc.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`,
  ethereumRpcUrl:
    'https://eth-mainnet.g.alchemy.com/v2/r_90486YPzsH08NHqDQsNxjJBKoBwiOE',
  kadenaBridgeNamespace: 'n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff',
  kadenaBridgeAdmin:
    'r:n_e595727b657fbbb3b8e362a05a7bb8d12865c1ff.bridge-admin',
}
export const kinesisClient = createKinesisClient(config)
