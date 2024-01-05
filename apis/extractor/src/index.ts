import 'dotenv/config'

import * as Sentry from '@sentry/node'
import cors from 'cors'
import express, { type Express, type Response } from 'express'
import { TokenInfo } from 'sushi'
import { Token } from 'sushi/currency'
import { CHAIN_ID, PORT, SENTRY_DSN, SENTRY_ENVIRONMENT } from './config'
import extractor from './extractor'
import poolCodes from './handlers/pool-codes'
import poolCodesForToken from './handlers/pool-codes-for-token'
import prices from './handlers/prices'
import { v3, v3_1, v3_2 } from './handlers/swap'
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

app.set('json replacer', (_key: string, value: any) =>
  typeof value === 'bigint' ? value.toString() : value,
)

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.use(cors())

app.get('/health', (_, res: Response) => {
  return res.status(extractor.isStarted() ? 200 : 503).send()
})

app.get('/pool-codes', poolCodes)

app.get('/pool-codes-for-token', poolCodesForToken)

app.get('/prices', prices)

app.get('/swap', v3)
app.get('/swap/v3.1', v3_1)
app.get('/swap/v3.2', v3_2)

// app.get('/debug-sentry', function mainHandler(req, res) {
//   throw new Error('My first Sentry error!')
// })

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  console.log(`Extractor ${CHAIN_ID} app listening on port ${PORT}`)

  requestStatistics.start()

  // fetch(`https://tokens.sushi.com/v1/${CHAIN_ID}`)
  //   .then((res) => res.json() as Promise<TokenInfo[]>)
  //   .then((tokenList) => {
  //     extractor.start(
  //       tokenList.map(
  //         (token) =>
  //           new Token({
  //             chainId: token.chainId,
  //             address: token.address,
  //             decimals: token.decimals,
  //             symbol: token.symbol,
  //             name: token.name,
  //           }),
  //       ),
  //     )
  //   })
  //   .catch((e) => {
  //     console.log('Error fetching tokens')
  //     throw e
  //   })
})

process.on('SIGTERM', (code) => {
  console.log(`About to exit with code: ${code}`)
  // if (extractor.isStarted()) {
  //   await extractor.stop()
  // }
})
