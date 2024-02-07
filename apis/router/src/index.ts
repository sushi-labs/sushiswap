import 'dotenv/config'

import * as Sentry from '@sentry/node'
import cors from 'cors'
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express'
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

// import overloadProtection from 'overload-protection'
import eventLoopLag from 'event-loop-lag'

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

  app.use(cors())

  const cpuUsageStatistics = new CPUUsageStatistics(1_000)
  cpuUsageStatistics.start()

  const interval = 5 // how often to refresh our measurement
  const lag = eventLoopLag(interval)

  const protection = (_req: Request, res: Response, next: NextFunction) => {
    const _lag = lag()
    // console.log(`Event loop lag: ${_lag}ms`)
    // console.log(`Cpu usage: ${cpuUsageStatistics.lastUtilisation}%`)
    if (_lag > 100) {
      return res
        .setHeader('Retry-After', 10)
        .status(503)
        .send('Service Unavailable')
    }
    return next()
  }

  app.get('/health', (_, res: Response) => {
    return res.status(client.lastUpdatedTimestamp === 0 ? 503 : 200).send()
  })

  app.get('/swap/v1/:chainId', protection, (req, res) => {
    return swapV3_2(client)(req, res)
  })
  app.get('/token/v1/:chainId/:address', protection, tokenHandler(client))
  app.get('/prices/v1/:chainId', protection, pricesHandler(client))
  app.get(
    '/prices/v1/:chainId/:address',
    protection,
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
}

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
})

start()
