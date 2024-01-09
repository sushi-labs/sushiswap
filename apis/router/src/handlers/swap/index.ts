import {
  NativeWrapProvider,
  Router,
  RouterLiquiditySource,
  makeAPI02Object,
} from '@sushiswap/router'

import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import { ROUTE_PROCESSOR_3_2_ADDRESS } from 'sushi/config'
import { Address, PublicClient } from 'viem'
import { CHAIN_ID } from '../../config'
import requestStatistics, {
  ResponseRejectReason,
} from '../../request-statistics'
import { ExtractorClient } from './ExtractorClient'
import { querySchema3, querySchema3_1, querySchema3_2 } from './schema'

const nativeProvider = new NativeWrapProvider(
  CHAIN_ID as ChainId,
  undefined as unknown as PublicClient, // actually it is not used
)

const clients: Map<ChainId, ExtractorClient> = new Map()

function handler(
  qSchema: typeof querySchema3 | typeof querySchema3_1 | typeof querySchema3_2,
  rpCode: typeof Router.routeProcessor3Params,
  rpAddress: Record<number, Address>,
) {
  return async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
    try {
      const statistics = requestStatistics.requestProcessingStart()

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

      const client = clients.get(chainId)
      if (client === undefined) {
        requestStatistics.requestRejected(
          ResponseRejectReason.UNSUPPORTED_NETWORK,
        )
        return res.status(422).send(`Network ${chainId} is not supported`)
      }

      const tokenInP = client.getToken(_tokenIn)
      const tokenOutP = client.getToken(_tokenOut)
      const tokensAreKnown =
        !(tokenInP instanceof Promise) && !(tokenOutP instanceof Promise)
      const tokenIn = tokenInP instanceof Promise ? await tokenInP : tokenInP
      const tokenOut =
        tokenOutP instanceof Promise ? await tokenOutP : tokenOutP
      if (!tokenIn || !tokenOut) {
        requestStatistics.requestRejected(
          ResponseRejectReason.UNSUPPORTED_TOKENS,
        )
        return res
          .status(422)
          .send(`Unknown token ${tokenIn === undefined ? _tokenIn : _tokenOut}`)
      }

      const poolCodesMap = tokensAreKnown
        ? client.getKnownPoolCodesForTokens(tokenIn, tokenOut) // fast version
        : await client.fetchPoolCodesForTokens(tokenIn, tokenOut, 2_000)
      nativeProvider
        .getCurrentPoolList()
        .forEach((p) => poolCodesMap.set(p.pool.uniqueID(), p))

      // const common = BASES_TO_CHECK_TRADES_AGAINST?.[chainId] ?? []
      // const additionalA = tokenIn
      //   ? ADDITIONAL_BASES[chainId]?.[tokenIn.wrapped.address] ?? []
      //   : []
      // const additionalB = tokenOut
      //   ? ADDITIONAL_BASES[chainId]?.[tokenOut.wrapped.address] ?? []
      //   : []

      // const tokens = [
      //   tokenIn.wrapped,
      //   tokenOut.wrapped,
      //   ...common,
      //   ...additionalA,
      //   ...additionalB,
      // ]

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
      return res.json(json)
    } catch (e) {
      requestStatistics.requestRejected(ResponseRejectReason.UNKNOWN_EXCEPTION)
      throw e
    }
  }
}

export const swapV3_2 = handler(
  querySchema3_2,
  Router.routeProcessor3_2Params,
  ROUTE_PROCESSOR_3_2_ADDRESS,
)
