import {
  NativeWrapProvider,
  PoolCode,
  Router,
  RouterLiquiditySource,
  makeAPI02Object,
} from '@sushiswap/router'
import {
  ADDITIONAL_BASES,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@sushiswap/router-config'
import { Request, Response } from 'express'
import { ChainId } from 'sushi/chain'
import {
  ROUTE_PROCESSOR_3_1_ADDRESS,
  ROUTE_PROCESSOR_3_2_ADDRESS,
  ROUTE_PROCESSOR_3_ADDRESS,
} from 'sushi/config'
import { Native } from 'sushi/currency'
import { Address } from 'viem'
import { CHAIN_ID } from '../../config'
import extractor from '../../extractor'
import requestStatistics, {
  ResponseRejectReason,
} from '../../request-statistics'
import { querySchema3, querySchema3_1, querySchema3_2 } from './schema'

const nativeProvider = new NativeWrapProvider(
  CHAIN_ID as ChainId,
  extractor.client,
)

function handler(
  qSchema: typeof querySchema3 | typeof querySchema3_1 | typeof querySchema3_2,
  rpCode: typeof Router.routeProcessor3Params,
  rpAddress: Record<number, Address>,
) {
  return async (req: Request, res: Response) => {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate=59')
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
      return res.json(json)
    } catch (e) {
      requestStatistics.requestRejected(ResponseRejectReason.UNKNOWN_EXCEPTION)
      throw e
    }
  }
}

export const v3 = handler(
  querySchema3,
  Router.routeProcessor3Params,
  ROUTE_PROCESSOR_3_ADDRESS,
)
export const v3_1 = handler(
  querySchema3_1,
  Router.routeProcessor3_1Params,
  ROUTE_PROCESSOR_3_1_ADDRESS,
)
export const v3_2 = handler(
  querySchema3_2,
  Router.routeProcessor3_2Params,
  ROUTE_PROCESSOR_3_2_ADDRESS,
)
