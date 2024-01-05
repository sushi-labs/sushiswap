import 'dotenv/config'

import * as Sentry from '@sentry/node'
import { PoolCode, Router } from '@sushiswap/router'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
import express, { type Express, type Request, type Response } from 'express'
import {
  type ExtractorSupportedChainId,
  ROUTE_PROCESSOR_3_1_ADDRESS,
  ROUTE_PROCESSOR_3_2_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
  isExtractorSupportedChainId,
} from 'sushi/config'
import { Token } from 'sushi/currency'
import { isAddress } from 'viem'
import z from 'zod'
import { CHAIN_ID, PORT, SENTRY_DSN, SENTRY_ENVIRONMENT } from './config'
import extractor from './extractor'
import processRequest from './process-request'
import requestStatistics from './request-statistics'
import {
  querySchema3,
  querySchema3_1,
  querySchema3_2,
  zChainId,
} from './schema'

async function bootstrap() {
  const app: Express = express()
  const { serialize } = await import('wagmi')

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

  app.get('/health', (_, res: Response) => {
    return res.status(extractor.isStarted() ? 200 : 503).send()
  })

  app.get('/pool-codes-for-token', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    // console.log('HTTP: GET /get-pool-codes-for-tokens', JSON.stringify(req.query))
    const { chainId, address } = z
      .object({
        chainId: zChainId
          .refine((chainId) => isExtractorSupportedChainId(chainId), {
            message: 'ChainId not supported.',
          })
          .transform((chainId) => chainId as ExtractorSupportedChainId),
        address: z.coerce.string().refine(isAddress, {
          message: 'Address is not checksummed.',
        }),
      })
      .parse(req.query)

    const tokenManager = extractor.tokenManager
    const token = (await tokenManager.findToken(address)) as Token
    const poolCodesMap = new Map<string, PoolCode>()
    const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    const additional = ADDITIONAL_BASES[chainId]?.[token.wrapped.address] ?? []
    const tokens = Array.from(
      new Set([token.wrapped, ...common, ...additional]),
    )
    const { prefetched: cachedPoolCodes, fetchingNumber } =
      extractor.getPoolCodesForTokensFull(tokens)
    cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
    if (fetchingNumber > 0) {
      const poolCodes = await extractor.getPoolCodesForTokensAsync(
        tokens,
        2_000,
      )
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.address, p))
    }
    return res.json(serialize(Array.from(poolCodesMap.values())))
  })

  app.get('/pool-codes', async (_req: Request, res: Response) => {
    // console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    // const { chainId } = z
    //   .object({
    //     chainId: zChainId
    //       .refine((chainId) => isExtractorSupportedChainId(chainId), {
    //         message: 'ChainId not supported.',
    //       })
    //       .transform((chainId) => chainId as ExtractorSupportedChainId),
    //   })
    //   .parse(req.query)
    const poolCodes = extractor.getCurrentPoolCodes()
    res.json(serialize(poolCodes))
  })

  app.get(
    '/',
    processRequest(
      querySchema3,
      Router.routeProcessor3Params,
      ROUTE_PROCESSOR_3_ADDRESS,
    ),
  )
  app.get(
    '/v3.1',
    processRequest(
      querySchema3_1,
      Router.routeProcessor3_1Params,
      ROUTE_PROCESSOR_3_1_ADDRESS,
    ),
  )
  app.get(
    '/v3.2',
    processRequest(
      querySchema3_2,
      Router.routeProcessor3_2Params,
      ROUTE_PROCESSOR_3_2_ADDRESS,
    ),
  )

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

  // Finally, start the extractor
  await extractor.start(BASES_TO_CHECK_TRADES_AGAINST[CHAIN_ID])
}

bootstrap()
