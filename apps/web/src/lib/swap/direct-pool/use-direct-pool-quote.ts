'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { EVM_UI_FEE_DECIMAL } from 'src/config'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { ZERO } from 'sushi'
import { stringify } from 'viem'
import { directPoolQuoteResponseSchema, getDirectPoolQuoteUrl } from './api'
import type { UseDirectPoolTradeParams } from './types'
import { useDirectPoolContext } from './use-direct-pool-context'
import { createDirectPoolTrade } from './utils'

export function useDirectPoolTradeQuote(
  params: UseDirectPoolTradeParams | undefined,
): UseQueryResult<UseEvmTradeReturn, Error> {
  const variables: UseDirectPoolTradeParams = {
    chainId: params?.chainId,
    fromToken: params?.fromToken,
    toToken: params?.toToken,
    amount: params?.amount,
    slippagePercentage: params?.slippagePercentage ?? '0.5',
    fee: params?.fee,
    gasPrice: params?.gasPrice,
    recipient: params?.recipient,
    directPool: params?.directPool,
    enabled: params?.enabled ?? false,
    carbonOffset: params?.carbonOffset ?? false,
  }
  const {
    amount,
    chainId,
    directPool,
    enabled,
    fee = EVM_UI_FEE_DECIMAL,
    fromToken,
    gasPrice,
    slippagePercentage,
    toToken,
  } = variables
  const { effectiveFee, eligible, nativePrice, supportedChainId } =
    useDirectPoolContext(variables, fee)

  return useQuery({
    queryKey: [
      'directPoolQuote',
      {
        amount,
        chainId,
        directPool,
        effectiveFee,
        fromToken,
        gasPrice,
        nativePrice,
        slippagePercentage,
        toToken,
      },
    ],
    queryFn: async (): Promise<UseEvmTradeReturn> => {
      if (
        !amount ||
        !directPool ||
        !fromToken ||
        !supportedChainId ||
        !toToken
      ) {
        throw new Error('Missing direct pool quote parameters')
      }

      const response = await fetch(
        getDirectPoolQuoteUrl({
          chainId: supportedChainId,
          tokenIn: fromToken.wrap().address,
          tokenOut: toToken.wrap().address,
          amount: amount.amount.toString(),
          feeTier: directPool.feeTier,
        }),
      )
      if (!response.ok) {
        throw new Error('Failed to quote direct pool')
      }

      const quote = directPoolQuoteResponseSchema.parse(await response.json())
      return createDirectPoolTrade({
        amount,
        chainId: supportedChainId,
        effectiveFee,
        estimatedGas: BigInt(quote.gasEstimate),
        fromToken,
        gasPrice,
        grossAmountOut: BigInt(quote.amountOut),
        nativePrice,
        slippagePercentage,
        toToken,
      })
    },
    enabled: Boolean(
      enabled && eligible && amount?.gt(ZERO) && supportedChainId,
    ),
    gcTime: 0,
    refetchInterval: 2500,
    refetchOnWindowFocus: true,
    retry: false,
    queryKeyHashFn: stringify,
  })
}
