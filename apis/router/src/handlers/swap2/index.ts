import { Logger, safeSerialize } from '@sushiswap/extractor'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { ROUTE_PROCESSOR_5_ADDRESS } from 'sushi/config'
import { Type } from 'sushi/currency'
import {
  NativeWrapProvider,
  PoolCode,
  ProcessFunction,
  Router,
  RouterLiquiditySource,
  TransferValue,
  isLsd,
  isStable,
  isWrapOrUnwrap,
} from 'sushi/router'
import { MultiRoute, getBigInt } from 'sushi/tines'
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
import { createSwapBody } from '../../create-swap-body.js'
// import { swapResponse } from './response.js'
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

function handler(
  querySchema: typeof querySchema5,
  routeProcessorParams: typeof Router.routeProcessor5Params,
  routeProcessorAddress: Address,
) {
  return (client: ExtractorClient) => {
    return async (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=28')

      let poolCodesMap: Map<string, PoolCode> = new Map()
      let route: MultiRoute | undefined = undefined

      let amountValueTransfer: bigint | undefined = undefined
      let processFunction = ProcessFunction.ProcessRoute

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
          amount: _amount,
          gasPrice,
          source,
          to,
          preferSushi,
          maxPriceImpact,
          maxSlippage,
          enableFee,
          feeReceiver,
          fee,
          feeBy,
          includeTransaction,
          includeRouteProcessorParams,
          includeRoute,
          debug,
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

        const chargeFee =
          enableFee &&
          !isWrapOrUnwrap({ fromToken: tokenIn, toToken: tokenOut }) &&
          !isStable({ fromToken: tokenIn, toToken: tokenOut }) &&
          !isLsd({ fromToken: tokenIn, toToken: tokenOut })

        if (chargeFee && feeBy === TransferValue.Input) {
          processFunction = ProcessFunction.ProcessRouteWithTransferValueInput
          amountValueTransfer =
            (_amount * getBigInt(fee * 1_000_000)) / 1_000_000n
        }

        const amount =
          feeBy === TransferValue.Input && amountValueTransfer
            ? _amount - amountValueTransfer
            : _amount

        route = preferSushi
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
          // If price impact is missing from the route we return no way multiroute
          route.priceImpact === undefined ||
          (maxPriceImpact !== undefined &&
            // or if max price impact is defined and less than best route price impact we return no way multiroute (not a feature we use at UI)
            route.priceImpact > maxPriceImpact)
        )
          route = Router.NoWayMultiRoute(tokenIn, tokenOut)

        const minAmountOut =
          (route.amountOutBI * getBigInt((1 - maxSlippage) * 1_000_000)) /
          1_000_000n

        if (chargeFee && feeBy === TransferValue.Output) {
          processFunction = ProcessFunction.ProcessRouteWithTransferValueOutput

          amountValueTransfer =
            (minAmountOut * getBigInt(fee * 1_000_000)) / 1_000_000n
        }

        const body = createSwapBody(
          route,
          to
            ? routeProcessorParams(
                poolCodesMap,
                route,
                tokenIn,
                tokenOut,
                to,
                routeProcessorAddress,
                [],
                maxSlippage, // probably just pass min amount out through instead?
                source ?? RouterLiquiditySource.Sender,
                processFunction,
                feeReceiver,
                amountValueTransfer,
              )
            : undefined,
          routeProcessorAddress,
          includeRouteProcessorParams,
          includeTransaction,
          includeRoute,
          debug,
        )

        // return swapResponse()

        swapRequestStatistics.requestWasProcessed(statistics, tokensAreKnown)
        return res.json(body)
      } catch (e) {
        swapRequestStatistics.requestRejected(
          ResponseRejectReason.UNKNOWN_EXCEPTION,
        )

        const data: {
          error: string | string[] | undefined
          params: z.infer<typeof querySchema5> | undefined
          route: ReturnType<typeof createSwapBody> | undefined
        } = {
          error: undefined,
          params: undefined,
          route: undefined,
        }
        try {
          data.error = e instanceof Error ? e.stack?.split('\n') : `${e}`
          if (parsed.data) data.params = parsed.data
          if (route) data.route = createSwapBody(route)
        } catch (_e) {}

        Logger.error(CHAIN_ID, 'Routing crashed', safeSerialize(data), false)

        return res.status(500).send('Internal server error: Routing crashed')
      }
    }
  }
}

export const swapV5 = handler(
  querySchema5,
  Router.routeProcessor5Params,
  ROUTE_PROCESSOR_5_ADDRESS[CHAIN_ID],
)
