import { NativeAddress, apiAdapter02To01 } from '@sushiswap/react-query'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  CrossChainTradeSchema,
  GetCrossChainTradeParams,
  SushiXSwap2Adapter,
  SushiXSwapFunctionName,
  SushiXSwapTransactionType,
  SushiXSwapWriteArgs,
} from 'src/lib/swap/cross-chain'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { RouteStatus } from 'sushi/router'
import { stringify } from 'viem'

export interface UseCrossChainTradeReturn {
  status: RouteStatus
  adapter: SushiXSwap2Adapter
  tokenIn: Type
  tokenOut: Type
  srcBridgeToken?: Type
  dstBridgeToken?: Type
  amountIn?: Amount<Type>
  amountOut?: Amount<Type>
  amountOutMin?: Amount<Type>
  priceImpact?: Percent
  srcTrade?: ReturnType<typeof apiAdapter02To01>
  dstTrade?: ReturnType<typeof apiAdapter02To01>
  transactionType?: SushiXSwapTransactionType
  gasSpent?: string
  bridgeFee?: string
  srcGasFee?: string
  functionName?: SushiXSwapFunctionName
  writeArgs?: SushiXSwapWriteArgs
  value?: string
}

export interface UseCrossChainTradeParms
  extends Omit<
    GetCrossChainTradeParams,
    'tokenIn' | 'tokenOut' | 'amount' | 'gasSpent'
  > {
  adapter?: SushiXSwap2Adapter
  tokenIn?: Type
  tokenOut?: Type
  amount?: Amount<Type>
  query?: Omit<
    UseQueryOptions<UseCrossChainTradeReturn>,
    'queryFn' | 'queryKey'
  >
}

export const useCrossChainTrade = ({
  query,
  ...params
}: UseCrossChainTradeParms) => {
  const { tokenIn, tokenOut, amount, slippagePercentage, ...rest } = params

  return useQuery<UseCrossChainTradeReturn>({
    ...query,
    queryKey: ['cross-chain', params],
    queryFn: async (): Promise<UseCrossChainTradeReturn> => {
      if (!tokenIn || !tokenOut || !amount) throw new Error()

      const url = new URL('/api/cross-chain', window.location.origin)

      url.searchParams.set(
        'tokenIn',
        tokenIn.isNative ? NativeAddress : tokenIn.address,
      )
      url.searchParams.set(
        'tokenOut',
        tokenOut.isNative ? NativeAddress : tokenOut.address,
      )
      url.searchParams.set('amount', amount.quotient.toString())
      url.searchParams.set('maxSlippage', `${+slippagePercentage / 100}`)

      Object.entries(rest).forEach(([key, value]) => {
        value && url.searchParams.set(key, value.toString())
      })

      const res = await fetch(url.toString())

      const json = await res.json()

      const parsed = CrossChainTradeSchema.parse(json)

      const { status, adapter } = parsed

      if (status === RouteStatus.NoWay)
        return {
          status,
          adapter,
          tokenIn,
          tokenOut,
        }

      const srcBridgeToken = parsed.srcBridgeToken.isNative
        ? Native.deserialize(parsed.srcBridgeToken)
        : Token.deserialize(parsed.srcBridgeToken)

      const dstBridgeToken = parsed.dstBridgeToken.isNative
        ? Native.deserialize(parsed.dstBridgeToken)
        : Token.deserialize(parsed.dstBridgeToken)

      const srcTrade = parsed.srcTrade
        ? apiAdapter02To01(
            parsed.srcTrade,
            tokenIn,
            srcBridgeToken,
            parsed.srcTrade?.status !== RouteStatus.NoWay
              ? parsed.srcTrade?.routeProcessorArgs?.to
              : undefined,
          )
        : undefined

      const dstTrade = parsed.dstTrade
        ? apiAdapter02To01(
            parsed.dstTrade,
            dstBridgeToken,
            tokenOut,
            parsed.dstTrade.status !== RouteStatus.NoWay
              ? parsed.dstTrade.routeProcessorArgs?.to
              : undefined,
          )
        : undefined

      return {
        ...parsed,
        tokenIn,
        tokenOut,
        srcBridgeToken,
        dstBridgeToken,
        srcTrade,
        dstTrade,
        amountIn: Amount.fromRawAmount(tokenIn, parsed.amountIn),
        amountOut: Amount.fromRawAmount(tokenOut, parsed.amountOut),
        amountOutMin: Amount.fromRawAmount(tokenOut, parsed.amountOutMin),
        priceImpact: new Percent(Math.round(parsed.priceImpact * 10000), 10000),
        gasSpent: parsed.gasSpent
          ? Amount.fromRawAmount(
              Native.onChain(tokenIn.chainId),
              parsed.gasSpent,
            ).toFixed(6)
          : undefined,
        bridgeFee: parsed.bridgeFee
          ? Amount.fromRawAmount(
              Native.onChain(tokenIn.chainId),
              parsed.bridgeFee,
            ).toFixed(6)
          : undefined,
        srcGasFee: parsed.srcGasFee
          ? Amount.fromRawAmount(
              Native.onChain(tokenIn.chainId),
              parsed.srcGasFee,
            ).toFixed(6)
          : undefined,
      }
    },
    enabled: query?.enabled !== false && Boolean(tokenIn && tokenOut && amount),
    queryKeyHashFn: stringify,
  })
}
