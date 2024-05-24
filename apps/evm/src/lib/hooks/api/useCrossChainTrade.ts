import { NativeAddress, tradeValidator02 } from '@sushiswap/react-query'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'
import {
  SushiXSwap2Adapter,
  SushiXSwapTransactionType,
} from 'src/lib/swap/cross-chain'
import {
  CrossChainTradeSchema,
  GetCrossChainTradeParams,
} from 'src/lib/swap/cross-chain/actions/getCrossChainTrade'
import { Amount, Native, Token, Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { stringify } from 'viem'
import { z } from 'zod'

export interface UseCrossChainTradeResult {
  status: 'Success' | 'Partial' | 'NoWay' // TODO: surely this exported elsewhere
  adapter: SushiXSwap2Adapter
  tokenIn: Type
  tokenOut: Type
  srcBridgeToken?: Type
  dstBridgeToken?: Type
  amountIn?: Amount<Type>
  amountOut?: Amount<Type>
  amountOutMin?: Amount<Type>
  priceImpact?: Percent
  srcTrade?: z.infer<typeof tradeValidator02>
  dstTrade?: z.infer<typeof tradeValidator02>
  transactionType?: SushiXSwapTransactionType
  gasSpent?: string
  bridgeFee?: string
  srcGasFee?: string
  functionName?: string
  writeArgs?: (string | object)[]
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
    UseQueryOptions<UseCrossChainTradeResult>,
    'queryFn' | 'queryKey'
  >
}

export const useCrossChainTrade = ({
  query,
  ...params
}: UseCrossChainTradeParms) => {
  const { tokenIn, tokenOut, amount, slippagePercentage, ...rest } = params

  return useQuery<UseCrossChainTradeResult>({
    ...query,
    queryKey: [stringify(params)],
    queryFn: async () => {
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
      url.searchParams.set('maxPriceImpact', `${+slippagePercentage / 100}`)

      Object.entries(rest).forEach(([key, value]) => {
        value && url.searchParams.set(key, value.toString())
      })

      const res = await fetch(url.toString())

      const json = await res.json()

      const parsed = CrossChainTradeSchema.parse(json)

      const { status, adapter } = parsed

      if (status === 'NoWay')
        return {
          status,
          adapter,
          tokenIn,
          tokenOut,
        }

      return {
        ...parsed,
        tokenIn,
        tokenOut,
        srcBridgeToken: new Token({
          ...parsed.srcBridgeToken,
          chainId: rest.srcChainId,
        }),
        dstBridgeToken: new Token({
          ...parsed.dstBridgeToken,
          chainId: rest.dstChainId,
        }),
        amountIn: Amount.fromRawAmount(tokenIn, parsed.amountIn),
        amountOut: Amount.fromRawAmount(tokenOut, parsed.amountOut),
        amountOutMin: Amount.fromRawAmount(tokenOut, parsed.minAmountOut),
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
  })
}
