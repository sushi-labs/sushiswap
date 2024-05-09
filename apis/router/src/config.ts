import { ChainId } from 'sushi/chain'
import { ExtractorSupportedChainId, STABLES } from 'sushi/config'

// If token is unknown - how much ms to wait it's pools from the extractor
export const POOL_FETCH_TIMEOUT = 3_000

// If extractor is not available - stop to provide routing after this time (ms)
export const MAX_TIME_WITHOUT_NETWORK_UPDATE = 120_000

// How often to update pools from extractor
export const POOL_UPDATE_INTERVAL = (_chainId: ChainId) => 6_000

// How often to update requested pairs from extractor
export const REQUESTED_PAIRS_UPDATE_INTERVAL = (_chainId: ChainId) => 120_000

// What port to listen
export const PORT = process.env['PORT'] || 80

export const SENTRY_DSN = process.env['SENTRY_DSN'] as string
if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN is not set')
}
export const SENTRY_ENVIRONMENT = process.env['SENTRY_ENVIRONMENT'] as string
if (!SENTRY_ENVIRONMENT) {
  throw new Error('SENTRY_ENVIRONMENT is not set')
}

export const CHAIN_ID = Number(
  process.env['CHAIN_ID'],
) as ExtractorSupportedChainId
if (!CHAIN_ID) {
  throw new Error('CHAIN_ID is not set')
}

export const EXTRACTOR_SERVER =
  process.env['EXTRACTOR_SERVER'] || `http://extractor-${CHAIN_ID}-service`
if (!EXTRACTOR_SERVER) {
  throw new Error('EXTRACTOR_SERVER is not set')
}

if (!Array.isArray(STABLES[CHAIN_ID]) || !STABLES[CHAIN_ID].length) {
  throw new Error(`ChainId ${CHAIN_ID} has no stables configured`)
}

export const ROUTER_CONFIG: Record<number, Record<string, any>> = {
  [ChainId.BSC]: {
    //priceIncrementalMode: true, // Only prices of changed pools are recalculated
    //checkPricesIncrementalModeCorrectness: true, // if priceIncrementalMode then make correctness check (resourcefull)
  },
}
