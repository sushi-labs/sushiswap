import { ChainId } from 'sushi/chain'

export const POOL_FETCH_TIMEOUT = 2_000

export const PORT = process.env['PORT'] || 80

export const SENTRY_DSN = process.env['SENTRY_DSN'] as string
if (!SENTRY_DSN) {
  throw new Error('SENTRY_DSN is not set')
}
export const SENTRY_ENVIRONMENT = process.env['SENTRY_ENVIRONMENT'] as string
if (!SENTRY_ENVIRONMENT) {
  throw new Error('SENTRY_ENVIRONMENT is not set')
}

export const CHAIN_ID = Number(process.env['CHAIN_ID'])
if (!CHAIN_ID) {
  throw new Error('CHAIN_ID is not set')
}

export const ROUTER_CONFIG = {
  [ChainId.ETHEREUM]: {
    extractor: 'http://localhost:1337',
  },
}
