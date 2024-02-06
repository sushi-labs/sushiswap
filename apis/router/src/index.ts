import 'dotenv/config'

import * as Sentry from '@sentry/node'
import cors from 'cors'
import express, { type Express, type Response } from 'express'
import protect from 'overload-protection'
import { ChainId } from 'sushi/chain'
import { ExtractorClient } from './ExtractorClient'
import {
  CHAIN_ID,
  EXTRACTOR_SERVER,
  POOL_UPDATE_INTERVAL,
  PORT,
  REQUESTED_PAIRS_UPDATE_INTERVAL,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
} from './config'
import { CPUUsageStatistics } from './cpu-usage-statistics'
import { priceByAddressHandler, pricesHandler } from './handlers/prices'
import { swapV3_2 } from './handlers/swap'
import tokenHandler from './handlers/token'
import requestStatistics from './request-statistics'

const app: Express = express()

const surgeProtection = protect('express', {
  production: process.env['NODE_ENV'] === 'production', // if production is false, detailed error messages are exposed to the client
  clientRetrySecs: 1, // Retry-After header, in seconds (0 to disable) [default 1]
  sampleInterval: 5, // sample rate, milliseconds [default 5]
  maxEventLoopDelay: 16, // maximum detected delay between event loop ticks [default 42]
  maxHeapUsedBytes: 0, // maximum heap used threshold (0 to disable) [default 0]
  maxRssBytes: 0, // maximum rss size threshold (0 to disable) [default 0]
  errorPropagationMode: false, // dictate behavior: take over the response or propagate an error to the framework [default false]
  logging: false, // set to string for log level or function to pass data to
  logStatsOnReq: false, // set to true to log stats on every requests
})

const client = new ExtractorClient(
  CHAIN_ID as ChainId,
  EXTRACTOR_SERVER as string,
  POOL_UPDATE_INTERVAL(CHAIN_ID as ChainId),
  REQUESTED_PAIRS_UPDATE_INTERVAL(CHAIN_ID as ChainId),
)
client.start()

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 0.1, // Capture 10% of the transactions, reduce in production!,
})

requestStatistics.start()

const cpuUsageStatistics = new CPUUsageStatistics(60_000)
cpuUsageStatistics.start()

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())

app.get('/health', (_, res: Response) => {
  return res.status(client.lastUpdatedTimestamp === 0 ? 503 : 200).send()
})

app.get('/swap/v1/:chainId', surgeProtection, swapV3_2(client))
app.get('/token/v1/:chainId/:address', surgeProtection, tokenHandler(client))
app.get('/prices/v1/:chainId', surgeProtection, pricesHandler(client))
app.get(
  '/prices/v1/:chainId/:address',
  surgeProtection,
  priceByAddressHandler(client),
)

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  console.log(`Router ${CHAIN_ID} app listening on port ${PORT}`)
})

// server.keepAliveTimeout = 65000
// server.headersTimeout = 66000
// server.keepAliveTimeout = 65000 // Ensure all inactive connections are terminated by the ALB, by setting this a few seconds higher than the ALB idle timeout
// server.headersTimeout = 66000 // Ensure the headersTimeout is set higher than the keepAliveTimeout due to this nodejs regression bug: https://github.com/nodejs/node/issues/27363

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
})
