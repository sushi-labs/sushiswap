export const POOL_FETCH_TIMEOUT = 2_000

export const MAX_TIME_WITHOUT_NETWORK_UPDATE = 120_000

export const POOL_UPDATE_INTERVAL = 10_000

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

export const EXTRACTOR_SERVER = process.env['EXTRACTOR_SERVER']
if (!EXTRACTOR_SERVER) {
  throw new Error('EXTRACTOR_SERVER is not set')
}
