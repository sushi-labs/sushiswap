'use client'

import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { QuoteService } from '../../services/quote-service'
import { CONTRACT_ADDRESSES } from '../../soroban/contract-addresses'
import { findPoolsBetweenTokens } from '../../soroban/dex-router-helpers'

export interface PoolQuoteParams {
  address: string
  zeroForOne: boolean
  amountIn?: bigint
  amountOut?: bigint
}

export const useQuoteExactInput = () => {
  const { amount, token0, token1 } = useSimpleSwapState()

  return useMutation({
    mutationKey: ['pool', 'quote', amount, token0, token1],
    mutationFn: async () => {
      if (!token0 || !token1 || !amount || Number(amount) <= 0) {
        return null
      }

      // Find pools between the two tokens to get the correct fee
      const pools = await findPoolsBetweenTokens(token0, token1)

      if (pools.length === 0) {
        throw new Error('No pools found between these tokens')
      }

      // Use the first pool (could implement better selection logic later)
      const pool = pools[0]

      const quoteService = new QuoteService()

      // Parse decimal string to bigint without precision loss
      const rawAmount = amount.toString()
      const [whole = '0', fraction = ''] = rawAmount.split('.')
      const paddedFraction = (fraction + '0'.repeat(token0.decimals)).slice(
        0,
        token0.decimals,
      )
      const normalized = `${whole}${paddedFraction}`.replace(/^0+(?=\d)/, '')
      const amountIn = BigInt(normalized || '0')

      const quote = await quoteService.getQuoteExactInputSingle({
        tokenIn: token0.contract,
        tokenOut: token1.contract,
        fee: pool.fee,
        amountIn: amountIn,
        sqrtPriceLimitX96: undefined, // No price limit
      })

      console.log('Quote result:', quote)

      // Return the amount out as a string
      return quote?.amountOut || '0'
    },
    onSuccess: (result) => {
      console.log('Pool quote executed successfully:', result)
    },
    onError: (error) => {
      console.error('Failed to execute pool quote:', error)
    },
  })
}
