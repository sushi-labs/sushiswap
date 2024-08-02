import { Logger, safeSerialize } from '@sushiswap/extractor'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { ROUTE_PROCESSOR_4_ADDRESS } from 'sushi/config'
import { Type } from 'sushi/currency'
import {
  NativeWrapProvider,
  PoolCode,
  Router,
  RouterLiquiditySource,
  makeAPI03Object,
} from 'sushi/router'
import { MultiRoute } from 'sushi/tines'
import { Address } from 'viem'
import { z } from 'zod'
import { ExtractorClient } from '../../ExtractorClient.js'
import swapRequestStatistics, {
  ResponseRejectReason,
} from '../../SwapRequestStatistics.js'
import {
  CHAIN_ID,
  MAX_TIME_WITHOUT_NETWORK_UPDATE,
  POOL_FETCH_TIMEOUT,
} from '../../config.js'
import { querySchema5 } from './schema.js'

const nativeProvider = new NativeWrapProvider(
  CHAIN_ID as ChainId,
  // @ts-ignore
  undefined, // actually it is not used
)

const delay = async (ms: number) => new Promise((res) => setTimeout(res, ms))

async function processUnknownToken(
  client: ExtractorClient,
  p: Promise<Type | undefined>,
) {
  const token = await p
  if (!token) return
  await Promise.any([client.fetchTokenPools(token), delay(POOL_FETCH_TIMEOUT)])
  return token
}

const handler = (
  querySchema: typeof querySchema5,
  routeProcessorParams: typeof Router.routeProcessor4Params,
  routeProcessorAddress: Address,
) => {
  return (client: ExtractorClient) => {
    return async (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=28')

      let poolCodesMap: Map<string, PoolCode> = new Map()
      let bestRoute: MultiRoute | undefined = undefined

      const statistics = swapRequestStatistics.requestProcessingStart()
      const parsed = querySchema.safeParse(req.query)
      if (!parsed.success) {
        swapRequestStatistics.requestRejected(
          ResponseRejectReason.WRONG_INPUT_PARAMS,
        )
        console.log(parsed.error.format())
        return res.status(422).send('Request parameters parsing error')
      }

      try {
        const {
          tokenIn: _tokenIn,
          tokenOut: _tokenOut,
          amount,
          gasPrice,
          source,
          to,
          preferSushi,
          maxPriceImpact,
          maxSlippage,
        } = parsed.data
        if (
          client.lastUpdatedTimestamp + MAX_TIME_WITHOUT_NETWORK_UPDATE <
          Date.now()
        ) {
          console.log('no fresh data')
          swapRequestStatistics.requestRejected(
            ResponseRejectReason.NO_FRESH_DATA,
          )
          return res.status(500).send(`Network ${CHAIN_ID} data timeout`)
        }

        type T = Type | undefined | Promise<Type | undefined>
        let tokenIn: T = client.getToken(_tokenIn)
        let tokenOut: T = client.getToken(_tokenOut)

        let tokensAreKnown = true
        if (tokenIn instanceof Promise) {
          tokensAreKnown = false
          tokenIn = await processUnknownToken(client, tokenIn)
        }
        if (tokenOut instanceof Promise) {
          tokensAreKnown = false
          tokenOut = await processUnknownToken(client, tokenOut)
        }

        if (!tokenIn || !tokenOut) {
          swapRequestStatistics.requestRejected(
            ResponseRejectReason.UNSUPPORTED_TOKENS,
          )
          return res
            .status(422)
            .send(
              `Unknown token ${tokenIn === undefined ? _tokenIn : _tokenOut}`,
            )
        }

        poolCodesMap = client.getKnownPoolsForTokens(tokenIn, tokenOut)
        nativeProvider
          .getCurrentPoolList()
          .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

        bestRoute = preferSushi
          ? Router.findSpecialRoute(
              poolCodesMap,
              CHAIN_ID,
              tokenIn,
              amount,
              tokenOut,
              gasPrice ?? 30e9,
              maxPriceImpact === undefined ? undefined : maxPriceImpact * 100,
            )
          : Router.findBestRoute(
              poolCodesMap,
              CHAIN_ID,
              tokenIn,
              amount,
              tokenOut,
              gasPrice ?? 30e9,
            )

        if (
          maxPriceImpact !== undefined &&
          (bestRoute.priceImpact ?? 0) > maxPriceImpact
        )
          bestRoute = Router.NoWayMultiRoute(tokenIn, tokenOut)

        const rpParams = to
          ? routeProcessorParams(
              poolCodesMap,
              bestRoute,
              tokenIn,
              tokenOut,
              to,
              routeProcessorAddress,
              [],
              maxSlippage,
              source ?? RouterLiquiditySource.Sender,
            )
          : undefined

        const json = makeAPI03Object(bestRoute, rpParams, routeProcessorAddress)

        swapRequestStatistics.requestWasProcessed(statistics, tokensAreKnown)
        return res.json(json)
      } catch (e) {
        swapRequestStatistics.requestRejected(
          ResponseRejectReason.UNKNOWN_EXCEPTION,
        )

        const data: {
          error: string | string[] | undefined
          params: z.infer<typeof querySchema5> | undefined
          route: ReturnType<typeof makeAPI03Object> | undefined
        } = {
          error: undefined,
          params: undefined,
          route: undefined,
        }
        try {
          data.error = e instanceof Error ? e.stack?.split('\n') : `${e}`
          if (parsed.data) data.params = parsed.data
          if (bestRoute) data.route = makeAPI03Object(bestRoute, undefined, '')
        } catch (_e) {}
        Logger.error(CHAIN_ID, 'Routing crashed', safeSerialize(data), false)

        return res.status(500).send('Internal server error: Routing crashed')
      }
    }
  }
}

export const swapV5 = handler(
  querySchema5,
  Router.routeProcessor4Params,
  ROUTE_PROCESSOR_4_ADDRESS[CHAIN_ID],
)
