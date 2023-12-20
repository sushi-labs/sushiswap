import 'dotenv/config'

import * as Sentry from '@sentry/node'
import { Extractor, type WarningLevel } from '@sushiswap/extractor'
import {
  NativeWrapProvider,
  PoolCode,
  Router,
  RouterLiquiditySource,
} from '@sushiswap/router'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
import cors from 'cors'
import express, { type Express, type Request, type Response } from 'express'
import { ChainId } from 'sushi/chain'
import {
  // EXTRACTOR_SUPPORTED_CHAIN_IDS,
  type ExtractorSupportedChainId,
  ROUTE_PROCESSOR_3_1_ADDRESS,
  ROUTE_PROCESSOR_3_2_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
  RouteProcessor3ChainId,
  type RouteProcessor3_1ChainId,
  type RouteProcessor3_2ChainId,
  isExtractorSupportedChainId,
  isRouteProcessor3ChainId,
  isRouteProcessor3_1ChainId,
  isRouteProcessor3_2ChainId,
} from 'sushi/config'
import { Native, Token } from 'sushi/currency'
import { type Address, isAddress } from 'viem'
import z from 'zod'
import { CONFIG_GROUPS, EXTRACTOR_CONFIG } from './config'
import { makeAPI02Object } from './makeAPI02Object'
import { RequestStatistics, ResponseRejectReason } from './requestStatistics'

const querySchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3ChainId(chainId as RouteProcessor3ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as RouteProcessor3ChainId),
  tokenIn: z.string(),
  tokenOut: z.string(),
  amount: z.string().transform((amount) => BigInt(amount)),
  gasPrice: z.optional(z.coerce.number().int().gt(0)),
  source: z.optional(z.nativeEnum(RouterLiquiditySource)),
  to: z
    .optional(z.string())
    .transform((to) => (to ? (to as Address) : undefined)),
  preferSushi: z.optional(z.coerce.boolean()),
  maxPriceImpact: z.optional(z.coerce.number()),
})

const querySchema3_1 = querySchema.extend({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3_1ChainId(chainId as RouteProcessor3_1ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as RouteProcessor3_1ChainId),
})

const querySchema3_2 = querySchema.extend({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .refine(
      (chainId) =>
        isRouteProcessor3_2ChainId(chainId as RouteProcessor3_2ChainId) &&
        isExtractorSupportedChainId(chainId),
      {
        message: 'ChainId not supported.',
      },
    )
    .transform((chainId) => chainId as Exclude<RouteProcessor3_2ChainId, 314>),
})

const PORT = process.env['PORT'] || 80

const CONFIG_GROUP_NAME =
  process.env['CONFIG_GROUP'] ?? ('DEFAULT' as keyof typeof CONFIG_GROUPS)

const SENTRY_DSN = process.env['SENTRY_DSN'] as string

const extractors = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  Extractor
>()
const nativeProviders = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  NativeWrapProvider
>()

const requestStatistics = new RequestStatistics(60_000, 3_600_000)

async function main() {
  const app: Express = express()
  Sentry.init({
    enabled: false,
    dsn: SENTRY_DSN,
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

  const CHAIN_IDS =
    CONFIG_GROUPS[CONFIG_GROUP_NAME as keyof typeof CONFIG_GROUPS]
  if (!CHAIN_IDS) {
    throw new Error(`CONFIG_GROUP '${CONFIG_GROUP_NAME}' is not supported`)
  }

  for (const chainId of CHAIN_IDS) {
    const extractor = new Extractor({
      ...EXTRACTOR_CONFIG[chainId],
      warningMessageHandler: (
        chain: ChainId | number | undefined,
        message: string,
        level: WarningLevel,
      ) => {
        Sentry.captureMessage(`${chain}: ${message}`, level)
      },
    })
    await extractor.start(BASES_TO_CHECK_TRADES_AGAINST[chainId])
    extractors.set(chainId, extractor)
    const nativeProvider = new NativeWrapProvider(chainId, extractor.client)
    nativeProviders.set(chainId, nativeProvider)
  }

  app.use(
    cors({
      origin: /sushi\.com$/,
    }),
  )

  // Trace incoming requests
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())

  app.get(
    '/',
    processRequest(
      querySchema,
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

  app.get('/health', (_, res: Response) => {
    const isStarted = Array.from(extractors.values()).every((e) =>
      e.isStarted(),
    )
    return res.status(isStarted ? 200 : 503).send()
  })

  app.get('/pool-codes-for-token', async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    // console.log('HTTP: GET /get-pool-codes-for-tokens', JSON.stringify(req.query))
    const { chainId, address } = z
      .object({
        chainId: z.coerce
          .number()
          .int()
          .gte(0)
          .lte(2 ** 256)
          .default(ChainId.ETHEREUM)
          .refine((chainId) => isExtractorSupportedChainId(chainId), {
            message: 'ChainId not supported.',
          })
          .transform((chainId) => chainId as ExtractorSupportedChainId),
        address: z.coerce.string().refine(isAddress, {
          message: 'Address is not checksummed.',
        }),
      })
      .parse(req.query)
    const extractor = extractors.get(chainId) as Extractor

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
    const { serialize } = await import('wagmi')
    return res.json(serialize(Array.from(poolCodesMap.values())))
  })

  app.get('/pool-codes', async (req: Request, res: Response) => {
    // console.log('HTTP: GET /pool-codes', JSON.stringify(req.query))
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    const { chainId } = z
      .object({
        chainId: z.coerce
          .number()
          .int()
          .gte(0)
          .lte(2 ** 256)
          .default(ChainId.ETHEREUM)
          .refine((chainId) => isExtractorSupportedChainId(chainId), {
            message: 'ChainId not supported.',
          })
          .transform((chainId) => chainId as ExtractorSupportedChainId),
      })
      .parse(req.query)
    const extractor = extractors.get(chainId) as Extractor
    const poolCodes = extractor.getCurrentPoolCodes()
    const { serialize } = await import('wagmi')
    res.json(serialize(poolCodes))
  })

  // app.get('/debug-sentry', function mainHandler(req, res) {
  //   throw new Error('My first Sentry error!')
  // })

  // The error handler must be registered before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
    requestStatistics.start()
  })
}

function processRequest(
  qSchema: typeof querySchema | typeof querySchema3_2,
  rpCode: typeof Router.routeProcessor3Params,
  rpAddress: Record<number, Address>,
) {
  return async (req: Request, res: Response) => {
    try {
      const statistics = requestStatistics.requestProcessingStart()

      // Server Overloaded protection - time not came
      // @ts-ignore
      // if (process.getActiveResourcesInfo().length > 150) {
      //   requestStatistics.requestRejected(
      //     ResponseRejectReason.SERVER_OVERLOADED,
      //   )
      //   return res.status(529).send('Server Overloaded')
      // }

      const parsed = qSchema.safeParse(req.query)
      if (!parsed.success) {
        requestStatistics.requestRejected(
          ResponseRejectReason.WRONG_INPUT_PARAMS,
        )
        return res.status(422).send('Request parameters parsing error')
      }
      const {
        chainId,
        tokenIn: _tokenIn,
        tokenOut: _tokenOut,
        amount,
        gasPrice,
        source,
        to,
        preferSushi,
        maxPriceImpact,
      } = parsed.data
      const extractor = extractors.get(chainId) as Extractor
      const tokenManager = extractor.tokenManager

      // Timing optimization: try to take tokens sync first - to avoid async call if tokens are known
      let tokensAreKnown = true
      let tokenIn =
        _tokenIn.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? Native.onChain(chainId)
          : tokenManager.getKnownToken(_tokenIn as Address)
      let tokenOut =
        _tokenOut.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
          ? Native.onChain(chainId)
          : tokenManager.getKnownToken(_tokenOut as Address)
      if (!tokenIn || !tokenOut) {
        // take unknown tokens async
        tokensAreKnown = false
        if (tokenIn === undefined && tokenOut !== undefined) {
          tokenIn = await tokenManager.findToken(_tokenIn as Address)
        } else if (tokenIn !== undefined && tokenOut === undefined) {
          tokenOut = await tokenManager.findToken(_tokenOut as Address)
        } else {
          // both tokens are unknown
          const tokens = await Promise.all([
            tokenManager.findToken(_tokenIn as Address),
            tokenManager.findToken(_tokenOut as Address),
          ])
          tokenIn = tokens[0]
          tokenOut = tokens[1]
        }
      }
      if (!tokenIn || !tokenOut) {
        requestStatistics.requestRejected(
          ResponseRejectReason.UNSUPPORTED_TOKENS,
        )
        return res
          .status(422)
          .send(`Unknown token ${tokenIn === undefined ? _tokenIn : _tokenOut}`)
      }

      const poolCodesMap = new Map<string, PoolCode>()
      const nativeProvider = nativeProviders.get(chainId) as NativeWrapProvider
      nativeProvider
        .getCurrentPoolList()
        .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

      const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
      const additionalA = tokenIn
        ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
        : []
      const additionalB = tokenOut
        ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
        : []

      const tokens = [
        tokenIn.wrapped,
        tokenOut.wrapped,
        ...common,
        ...additionalA,
        ...additionalB,
      ]

      const poolCodes = tokensAreKnown
        ? extractor.getPoolCodesForTokens(tokens) // fast version
        : await extractor.getPoolCodesForTokensAsync(tokens, 2_000)
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

      const bestRoute = preferSushi
        ? Router.findSpecialRoute(
            poolCodesMap,
            chainId,
            tokenIn,
            amount,
            tokenOut,
            gasPrice ?? 30e9,
          )
        : Router.findBestRoute(
            poolCodesMap,
            chainId,
            tokenIn,
            amount,
            tokenOut,
            gasPrice ?? 30e9,
          )

      const json = makeAPI02Object(
        bestRoute,
        to
          ? rpCode(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              rpAddress[chainId] as Address,
              [],
              maxPriceImpact,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined,
        rpAddress[chainId] as Address,
      )

      requestStatistics.requestWasProcessed(statistics, tokensAreKnown)
      return res.json(JSON.stringify(json))
    } catch (e) {
      requestStatistics.requestRejected(ResponseRejectReason.UNKNOWN_EXCEPTION)
      throw e
    }
  }
}

main()
