import 'dotenv/config'

import * as Sentry from '@sentry/node'
import express, { type Express, type Response } from 'express'
import { CHAIN_ID, PORT, SENTRY_DSN, SENTRY_ENVIRONMENT } from './config'
import { CPUUsageStatistics } from './cpu-usage-statistics'
import extractor from './extractor'
import poolCodes from './handlers/pool-codes'
import poolCodesForToken from './handlers/pool-codes-for-token'
import poolsBetween from './handlers/pools-between'
import poolsForToken from './handlers/pools-for-token'
import poolsJSON from './handlers/pools-json'
import requestedPairs from './handlers/requested-pairs'
import token from './handlers/token'
import requestStatistics from './request-statistics'

const app: Express = express()

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

const cpuUsageStatistics = new CPUUsageStatistics(60_000)
cpuUsageStatistics.start()

app.set('json replacer', (_key: string, value: any) =>
  typeof value === 'bigint' ? value.toString() : value,
)

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/health', (_, res: Response) => {
  return res.status(extractor.isStarted() ? 200 : 503).send()
})

app.get('/pool-codes', poolCodes)
app.get('/pool-codes-for-token', poolCodesForToken)

app.get('/token/:chainId/:address', token)
app.get('/pools-json/:chainId', poolsJSON)
app.get('/pools-for-token/:chainId/:address', poolsForToken)
app.get('/pools-between/:chainId/:addr0/:addr1', poolsBetween)
app.get('/requested-pairs/:chainId', requestedPairs)

// app.get('/debug-sentry', function mainHandler(req, res) {
//   throw new Error('My first Sentry error!')
// })

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  console.log(`Extractor ${CHAIN_ID} app listening on port ${PORT}`)

  requestStatistics.start()
})

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
  // if (extractor.isStarted()) {
  //   await extractor.stop()
  // }
})
