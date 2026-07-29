'use client'

import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { EVM_UI_FEE_DECIMAL } from 'src/config'
import type { UseEvmTradeReturn } from 'src/lib/hooks/react-query'
import { ZERO } from 'sushi'
import { type EvmAddress, RED_SNWAPPER_ADDRESS } from 'sushi/evm'
import { type Hex, stringify } from 'viem'
import { usePublicClient } from 'wagmi'
import type { UseDirectPoolTradeParams } from './types'
import { useDirectPoolContext } from './use-direct-pool-context'
import {
  createDirectPoolTrade,
  encodeDirectPoolSwap,
  getDirectPoolAmounts,
  getDirectPoolQuoteContractParameters,
} from './utils'

export function useDirectPoolTrade(
  params: UseDirectPoolTradeParams,
): UseQueryResult<UseEvmTradeReturn, Error> {
  const {
    amount,
    chainId,
    directPool,
    enabled,
    fee = EVM_UI_FEE_DECIMAL,
    fromToken,
    gasPrice,
    recipient,
    slippagePercentage,
    toToken,
  } = params
  const client = usePublicClient({ chainId })
  const { address, effectiveFee, eligible, nativePrice, supportedChainId } =
    useDirectPoolContext(params, fee)

  return useQuery({
    queryKey: [
      'directPoolTrade',
      {
        address,
        amount,
        chainId,
        directPool,
        effectiveFee,
        fromToken,
        gasPrice,
        nativePrice,
        recipient,
        slippagePercentage,
        toToken,
      },
    ],
    queryFn: async (): Promise<UseEvmTradeReturn> => {
      if (
        !address ||
        !amount ||
        !client ||
        !directPool ||
        !fromToken ||
        !recipient ||
        !supportedChainId ||
        !toToken
      ) {
        throw new Error('Missing direct pool trade parameters')
      }

      const quote = await client.readContract(
        getDirectPoolQuoteContractParameters({
          amount: amount.amount,
          chainId: supportedChainId,
          feeTier: directPool.feeTier,
          tokenIn: fromToken.wrap().address,
          tokenOut: toToken.wrap().address,
        }),
      )
      const grossAmountOut = quote[0]
      const { minAmountOut } = getDirectPoolAmounts({
        effectiveFee,
        grossAmountOut,
        slippagePercentage,
        toToken,
      })
      const encoded = encodeDirectPoolSwap({
        amountIn: amount.amount,
        amountOut: grossAmountOut,
        amountOutMin: minAmountOut.amount,
        chainId: supportedChainId,
        fee: effectiveFee,
        fromToken,
        poolAddress: directPool.address,
        recipient,
        toToken,
      })
      const estimateGas = client.estimateGas as (parameters: {
        account: EvmAddress
        to: EvmAddress
        data: Hex
        value: bigint
      }) => Promise<bigint>
      const estimatedGas = await estimateGas({
        account: address,
        to: RED_SNWAPPER_ADDRESS[supportedChainId],
        data: encoded.data,
        value: encoded.value,
      })
      const tx: NonNullable<UseEvmTradeReturn['tx']> = {
        from: address,
        to: RED_SNWAPPER_ADDRESS[supportedChainId],
        data: encoded.data,
        value: encoded.value,
        gas: estimatedGas.toString(),
      }

      return createDirectPoolTrade({
        amount,
        chainId: supportedChainId,
        effectiveFee,
        estimatedGas,
        fromToken,
        gasPrice,
        grossAmountOut,
        nativePrice,
        slippagePercentage,
        toToken,
        tx,
      })
    },
    enabled: Boolean(
      enabled &&
        address &&
        eligible &&
        client &&
        amount?.gt(ZERO) &&
        recipient &&
        supportedChainId,
    ),
    gcTime: 0,
    refetchInterval: address ? 5000 : false,
    refetchOnWindowFocus: true,
    retry: false,
    queryKeyHashFn: stringify,
  })
}
