import { createClient } from '@kadena/client'
import { KADENA_CHAIN_ID, KADENA_NETWORK_ID } from './network'

export const kadenaClient = createClient(
  `https://api.chainweb.com/chainweb/0.0/${KADENA_NETWORK_ID}/chain/${KADENA_CHAIN_ID}/pact`,
)
