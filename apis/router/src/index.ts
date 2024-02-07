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

// import overloadProtection from 'overload-protection'
// import eventLoopLag from 'event-loop-lag'
// import pidusage from 'pidusage'
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

  app.use(cors())

  const cpuUsageStatistics = new CPUUsageStatistics(10_000)
  cpuUsageStatistics.start()

  // const lag = eventLoopLag(1_000)

  // const cpuPoints: number[] = []
  // const cpuSma = 0
  // const cpuUsage = async (time: number) => {
  //   setTimeout(async () => {
  //     await (async () => {
  //       const { cpu } = await pidusage(process.pid)
  //       cpuPoints.push(cpu)
  //       if (cpuPoints.length > 60) {
  //         cpuPoints.shift()
  //       }
  //       cpuSma = cpuPoints.reduce((a, b) => a + b, 0) / cpuPoints.length
  //     })()
  //     cpuUsage(time)
  //   }, time)
  // }

  // cpuUsage(1_000)

  const protection = (_req: Request, _res: Response, next: NextFunction) => {
    // if (lag() > 100) {
    //   return res
    //     .setHeader('Retry-After', 10)
    //     .status(503)
    //     .send('Service Unavailable')
    // }
    return next()
  }

  app.get('/health', (_, res: Response) => {
    return res.status(client.lastUpdatedTimestamp === 0 ? 503 : 200).send()
  })

  app.get(`/swap/v1/${CHAIN_ID}`, protection, (req, res) => {
    return swapV3_2(client)(req, res)
  })
  app.get(`/token/v1/${CHAIN_ID}/:address`, protection, tokenHandler(client))
  app.get(`/prices/v1/${CHAIN_ID}`, protection, pricesHandler(client))
  app.get(
    `/prices/v1/${CHAIN_ID}/:address`,
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
