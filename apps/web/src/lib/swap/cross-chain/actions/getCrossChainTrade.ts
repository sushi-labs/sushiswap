import { tradeValidator02 } from '@sushiswap/react-query'
import { SushiXSwap2ChainId } from 'sushi/config'
import { RouteStatus } from 'sushi/router'
import { Address } from 'viem'
import { z } from 'zod'
import {
  SushiXSwap2Adapter,
  SushiXSwapFunctionName,
  SushiXSwapTransactionType,
} from '../lib'
import { getSquidCrossChainTrade } from './getSquidCrossChainTrade'
import { getStargateCrossChainTrade } from './getStargateCrossChainTrade'

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

const currencyValidator = z.union([
  z.object({
    isNative: z.literal(true),
    name: z.optional(z.string()),
    symbol: z.optional(z.string()),
    decimals: z.number(),
    chainId: z.number(),
  }),
  z.object({
    isNative: z.literal(false),
    name: z.optional(z.string()),
    symbol: z.optional(z.string()),
    address: z.string(),
    decimals: z.number(),
    chainId: z.number(),
  }),
])

const CrossChainTradeNotFoundSchema = z.object({
  adapter: z.nativeEnum(SushiXSwap2Adapter),
  status: z.enum([RouteStatus.NoWay]),
})

const CrossChainTradeFoundSchema = z.object({
  status: z.enum([RouteStatus.Success, RouteStatus.Partial]),
  adapter: z.nativeEnum(SushiXSwap2Adapter),
  tokenIn: z.string(),
  tokenOut: z.string(),
  srcBridgeToken: currencyValidator,
  dstBridgeToken: currencyValidator,
  amountIn: z.string(),
  amountOut: z.string(),
  amountOutMin: z.string(),
  priceImpact: z.number(),
  srcTrade: z.optional(tradeValidator02),
  dstTrade: z.optional(tradeValidator02),
  transactionType: z.optional(z.nativeEnum(SushiXSwapTransactionType)),
  gasSpent: z.optional(z.string()),
  bridgeFee: z.optional(z.string()),
  srcGasFee: z.optional(z.string()),
  functionName: z.optional(z.nativeEnum(SushiXSwapFunctionName)),
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
