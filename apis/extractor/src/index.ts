import 'dotenv/config'

import * as Sentry from '@sentry/node'
import { Logger, LogsMessageLevel } from '@sushiswap/extractor'
import express, { type Express, type Response } from 'express'
import {
  CHAIN_ID,
  PORT,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
} from './config/index.js'
import { CPUUsageStatistics } from './cpu-usage-statistics.js'
import extractor from './extractor.js'
import poolCodesBetween from './handlers/pool-codes-between/index.js'
import poolCodesBin from './handlers/pool-codes-bin/index.js'
import poolCodesForToken from './handlers/pool-codes-for-token/index.js'
import poolCodes from './handlers/pool-codes/index.js'
import requestedPairs from './handlers/requested-pairs/index.js'
import token from './handlers/token/index.js'
import requestStatistics from './request-statistics.js'

const app: Express = express()

Sentry.init({
  sampleRate: 1,
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({
      breadcrumbs: true,
      tracing: true,
    }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({
      app,
    }),
  ],
  // Performance Monitoring
  enableTracing: true,
  tracesSampleRate: 1,
  //debug: process.env['SENTRY_ENVIRONMENT'] !== 'production',
  // Called for message and error events
  beforeSend(event) {
    // Modify or drop the event here
    if (event.user) {
      // Don't send user's email address for example
      // delete event.user.email
    }
    return event
  },
})

Sentry.setTag('chainId', CHAIN_ID)

Logger.setLogsExternalHandler(
  (
    msg: string,
    level: LogsMessageLevel,
    context?: string,
    trace_id?: string,
  ) => {
    Sentry.captureMessage(
      msg,
      context === undefined
        ? level
        : {
            level,
            contexts: {
              trace: {
                data: { context },
                trace_id: trace_id ?? '0',
                span_id: '0',
              },
            },
          },
    )
  },
)

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

app.get('/token/:chainId/:address', token)
app.get('/pool-codes/:chainId', poolCodes)
app.get('/pool-codes-bin/:chainId', poolCodesBin)
app.get('/pool-codes-for-token/:chainId/:address', poolCodesForToken)
app.get('/pool-codes-between/:chainId/:addr0/:addr1', poolCodesBetween)
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
