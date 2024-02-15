import 'dotenv/config'

import * as Sentry from '@sentry/node'
// import cors from 'cors'
import express, { type Express, type Response } from 'express'
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
import { priceByAddressHandler, pricesHandler } from './handlers/price'
import swapHandler from './handlers/swap'
import tokenHandler from './handlers/token'

import process from 'node:process'
import requestStatistics from './request-statistics'

async function start() {
  const app: Express = express()

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

  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler())
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler())

  // app.use(cors())

  const cpuUsageStatistics = new CPUUsageStatistics(60_000)
  cpuUsageStatistics.start()

  app.get('/200', (_, res: Response) => {
    return res.status(200).end()
  })

  app.get('/health', (_, res: Response) => {
    return res.status(client.lastUpdatedTimestamp === 0 ? 503 : 200).send()
  })

  app.get(`/swap/v3.2/${CHAIN_ID}`, (req, res) => {
    return swapHandler(client)(req, res)
  })
  app.get(`/token/v1/${CHAIN_ID}/:address`, tokenHandler(client))
  app.get(`/price/v1/${CHAIN_ID}`, pricesHandler(client))
  app.get(`/price/v1/${CHAIN_ID}/:address`, priceByAddressHandler(client))

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())

  app.listen(PORT, () => {
    console.log(`Router ${CHAIN_ID} app listening on port ${PORT}`)
  })
}

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
})

start()
