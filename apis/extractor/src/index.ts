import 'dotenv/config'

import path from 'path'
import * as Sentry from '@sentry/node'
import {
  Extractor,
  TokenManager,
  type WarningLevel,
} from '@sushiswap/extractor'
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
import { EXTRACTOR_CONFIG } from './config'

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

const SENTRY_DSN = process.env['SENTRY_DSN'] as string

const extractors = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  Extractor
>()
const tokenManagers = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  TokenManager
>()
const nativeProviders = new Map<
  RouteProcessor3ChainId | RouteProcessor3_1ChainId | RouteProcessor3_2ChainId,
  NativeWrapProvider
>()

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

  for (const chainId of [ChainId.ARBITRUM]) {
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
    const tokenManager = new TokenManager(
      extractor.multiCallAggregator,
      path.resolve(__dirname, '../cache'),
      `./tokens-${chainId}`,
    )
    await tokenManager.addCachedTokens()
    tokenManagers.set(chainId, tokenManager)
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

  app.get('/', async (req: Request, res: Response) => {
    const parsed = querySchema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(422).send()
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
    const tokenManager = tokenManagers.get(chainId) as TokenManager
    const [tokenIn, tokenOut] = await Promise.all([
      _tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenIn as Address),
      _tokenOut === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenOut as Address),
    ])
    if (!tokenIn || !tokenOut) {
      throw new Error('tokenIn or tokenOut is not supported')
    }
    const poolCodesMap = new Map<string, PoolCode>()
    const nativeProvider = nativeProviders.get(chainId) as NativeWrapProvider
    nativeProvider
      .getCurrentPoolList()
      .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    const extractor = extractors.get(chainId) as Extractor
    const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    const additionalA = tokenIn
      ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
      : []
    const additionalB = tokenOut
      ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
      : []

    const tokens = Array.from(
      new Set([
        tokenIn.wrapped,
        tokenOut.wrapped,
        ...common,
        ...additionalA,
        ...additionalB,
      ]),
    )

    const { prefetched: cachedPoolCodes, fetchingNumber } =
      extractor.getPoolCodesForTokensFull(tokens)
    cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    if (fetchingNumber > 0) {
      const poolCodes = await extractor.getPoolCodesForTokensAsync(
        tokens,
        2_000,
      )
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))
    }

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

    const { serialize } = await import('wagmi')

    return res.json(
      serialize({
        route: {
          status: bestRoute?.status,
          fromToken:
            bestRoute?.fromToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.fromToken,
          toToken:
            bestRoute?.toToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.toToken,
          primaryPrice: bestRoute?.primaryPrice,
          swapPrice: bestRoute?.swapPrice,
          amountIn: bestRoute?.amountIn,
          amountInBI: bestRoute?.amountInBI,
          amountOut: bestRoute?.amountOut,
          amountOutBI: bestRoute?.amountOutBI,
          priceImpact: bestRoute?.priceImpact,
          totalAmountOut: bestRoute?.totalAmountOut,
          totalAmountOutBI: bestRoute?.totalAmountOutBI,
          gasSpent: bestRoute?.gasSpent,
          legs: bestRoute?.legs,
        },
        args: to
          ? Router.routeProcessor3Params(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              ROUTE_PROCESSOR_3_ADDRESS[chainId],
              [],
              maxPriceImpact,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined,
      }),
    )
  })

  app.get('/v3.1', async (req: Request, res: Response) => {
    const parsed = querySchema3_1.safeParse(req.query)
    if (!parsed.success) {
      return res.status(422).send()
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
    const tokenManager = tokenManagers.get(chainId) as TokenManager
    const [tokenIn, tokenOut] = await Promise.all([
      _tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenIn as Address),
      _tokenOut === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenOut as Address),
    ])
    if (!tokenIn || !tokenOut) {
      throw new Error('tokenIn or tokenOut is not supported')
    }
    const poolCodesMap = new Map<string, PoolCode>()
    const nativeProvider = nativeProviders.get(chainId) as NativeWrapProvider
    nativeProvider
      .getCurrentPoolList()
      .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    const extractor = extractors.get(chainId) as Extractor
    const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    const additionalA = tokenIn
      ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
      : []
    const additionalB = tokenOut
      ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
      : []

    const tokens = Array.from(
      new Set([
        tokenIn.wrapped,
        tokenOut.wrapped,
        ...common,
        ...additionalA,
        ...additionalB,
      ]),
    )

    const { prefetched: cachedPoolCodes, fetchingNumber } =
      extractor.getPoolCodesForTokensFull(tokens)
    cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    if (fetchingNumber > 0) {
      const poolCodes = await extractor.getPoolCodesForTokensAsync(
        tokens,
        2_000,
      )
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))
    }

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

    const { serialize } = await import('wagmi')

    return res.json(
      serialize({
        route: {
          status: bestRoute?.status,
          fromToken:
            bestRoute?.fromToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.fromToken,
          toToken:
            bestRoute?.toToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.toToken,
          primaryPrice: bestRoute?.primaryPrice,
          swapPrice: bestRoute?.swapPrice,
          amountIn: bestRoute?.amountIn,
          amountInBI: bestRoute?.amountInBI,
          amountOut: bestRoute?.amountOut,
          amountOutBI: bestRoute?.amountOutBI,
          priceImpact: bestRoute?.priceImpact,
          totalAmountOut: bestRoute?.totalAmountOut,
          totalAmountOutBI: bestRoute?.totalAmountOutBI,
          gasSpent: bestRoute?.gasSpent,
          legs: bestRoute?.legs,
        },
        args: to
          ? Router.routeProcessor3_1Params(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              ROUTE_PROCESSOR_3_1_ADDRESS[chainId],
              [],
              maxPriceImpact,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined,
      }),
    )
  })

  app.get('/v3.2', async (req: Request, res: Response) => {
    const parsed = querySchema3_2.safeParse(req.query)
    if (!parsed.success) {
      return res.status(422).send()
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
    const tokenManager = tokenManagers.get(chainId) as TokenManager
    const [tokenIn, tokenOut] = await Promise.all([
      _tokenIn === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenIn as Address),
      _tokenOut === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
        ? Native.onChain(chainId)
        : tokenManager.findToken(_tokenOut as Address),
    ])
    if (!tokenIn || !tokenOut) {
      throw new Error('tokenIn or tokenOut is not supported')
    }
    const poolCodesMap = new Map<string, PoolCode>()
    const nativeProvider = nativeProviders.get(chainId) as NativeWrapProvider
    nativeProvider
      .getCurrentPoolList()
      .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    const extractor = extractors.get(chainId) as Extractor
    const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
    const additionalA = tokenIn
      ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
      : []
    const additionalB = tokenOut
      ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
      : []
    const tokens = Array.from(
      new Set([
        tokenIn.wrapped,
        tokenOut.wrapped,
        ...common,
        ...additionalA,
        ...additionalB,
      ]),
    )

    const { prefetched: cachedPoolCodes, fetchingNumber } =
      extractor.getPoolCodesForTokensFull(tokens)
    cachedPoolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

    if (fetchingNumber > 0) {
      const poolCodes = await extractor.getPoolCodesForTokensAsync(
        tokens,
        2_000,
      )
      poolCodes.forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))
    }

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

    const { serialize } = await import('wagmi')

    return res.json(
      serialize({
        route: {
          status: bestRoute?.status,
          fromToken:
            bestRoute?.fromToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.fromToken,
          toToken:
            bestRoute?.toToken?.address === ''
              ? Native.onChain(chainId)
              : bestRoute?.toToken,
          primaryPrice: bestRoute?.primaryPrice,
          swapPrice: bestRoute?.swapPrice,
          amountIn: bestRoute?.amountIn,
          amountInBI: bestRoute?.amountInBI,
          amountOut: bestRoute?.amountOut,
          amountOutBI: bestRoute?.amountOutBI,
          priceImpact: bestRoute?.priceImpact,
          totalAmountOut: bestRoute?.totalAmountOut,
          totalAmountOutBI: bestRoute?.totalAmountOutBI,
          gasSpent: bestRoute?.gasSpent,
          legs: bestRoute?.legs,
        },
        args: to
          ? Router.routeProcessor3_2Params(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              ROUTE_PROCESSOR_3_2_ADDRESS[chainId],
              [],
              maxPriceImpact,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined,
      }),
    )
  })

  app.get('/health', (_, res: Response) => {
    return res.status(200).send()
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
    const tokenManager = tokenManagers.get(chainId) as TokenManager
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
  })
}
main()
