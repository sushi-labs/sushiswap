import 'dotenv/config'

import * as Sentry from '@sentry/node'
import cors from 'cors'
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
import { swapV3_2 } from './handlers/swap'

const app: Express = express()

const client = new ExtractorClient(
  CHAIN_ID as ChainId,
  EXTRACTOR_SERVER as string,
  POOL_UPDATE_INTERVAL,
  REQUESTED_PAIRS_UPDATE_INTERVAL,
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

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())

app.get('/health', (_, res: Response) => {
  return res.status(200).send()
})

app.get('/swap/v3.2', swapV3_2(client))

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  console.log(`Router ${CHAIN_ID} app listening on port ${PORT}`)
})

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
})
