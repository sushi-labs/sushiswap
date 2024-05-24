import { tokenValidator, tradeValidator02 } from '@sushiswap/react-query'
import { SushiXSwap2ChainId } from 'sushi/config'
import { Address } from 'viem'
import { z } from 'zod'
import {
  SushiXSwap2Adapter,
  // SushiXSwapTransactionType
} from '../lib'
import { getSquidCrossChainTrade } from './getSquidCrossChainTrade'
import { getStargateCrossChainTrade } from './getStargateCrossChainTrade'
// import { GetTradeReturn } from './getTrade'

export interface GetCrossChainTradeParams {
  srcChainId: SushiXSwap2ChainId
  dstChainId: SushiXSwap2ChainId
  tokenIn: Address
  tokenOut: Address
  amount: bigint
  srcGasPrice?: bigint
  dstGasPrice?: bigint
  slippagePercentage: string
  from?: Address
  recipient?: Address
}

const CrossChainTradeNotFoundSchema = z.object({
  adapter: z.nativeEnum(SushiXSwap2Adapter),
  status: z.enum(['NoWay']),
})

const CrossChainTradeFoundSchema = z.object({
  status: z.enum(['Success', 'Partial']),
  adapter: z.nativeEnum(SushiXSwap2Adapter),
  tokenIn: z.string(),
  tokenOut: z.string(),
  srcBridgeToken: tokenValidator,
  dstBridgeToken: tokenValidator,
  amountIn: z.string(),
  amountOut: z.string(),
  minAmountOut: z.string(),
  priceImpact: z.number(),
  srcTrade: z.optional(tradeValidator02),
  dstTrade: z.optional(tradeValidator02),
  // transactionType: z.nativeEnum(SushiXSwapTransactionType),
  gasSpent: z.optional(z.string()),
  bridgeFee: z.optional(z.string()),
  srcGasFee: z.optional(z.string()),
  functionName: z.optional(z.string()),
  writeArgs: z.optional(
    z.array(z.union([z.string(), z.object({}).passthrough()])),
  ),
  value: z.optional(z.string()),
})

export const CrossChainTradeSchema = z.union([
  CrossChainTradeNotFoundSchema,
  CrossChainTradeFoundSchema,
])

export type CrossChainTradeSchemaType = z.infer<typeof CrossChainTradeSchema>

export const getCrossChainTrade = async ({
  adapter,
  ...params
}: GetCrossChainTradeParams & { adapter: SushiXSwap2Adapter }) => {
  switch (adapter) {
    case SushiXSwap2Adapter.Squid:
      return getSquidCrossChainTrade(params)
    case SushiXSwap2Adapter.Stargate:
      return getStargateCrossChainTrade(params)
  }
}
