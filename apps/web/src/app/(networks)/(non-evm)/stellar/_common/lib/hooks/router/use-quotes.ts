'use client'

import { useMutation } from '@tanstack/react-query'
import { useSimpleSwapState } from '~stellar/_common/ui/Swap/simple/simple-swap-provider/simple-swap-provider'
import { QuoteService } from '../../services/quote-service'
import { findBestPath } from '../../soroban/dex-router-helpers'

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

      // Find best route (direct or multi-hop)
      const route = await findBestPath(token0, token1)

      if (!route) {
        // No route found - return null to indicate no quote available
        return null
      }

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

      if (route.type === 'direct') {
        // Single-hop swap
        const pool = route.pools[0]
        const quote = await quoteService.getQuoteExactInputSingle({
          tokenIn: token0.contract,
          tokenOut: token1.contract,
          fee: pool.fee,
          amountIn: amountIn,
          sqrtPriceLimitX96: undefined,
        })
        return quote?.amountOut || '0'
      } else {
        // Multi-hop swap - use the router's multi-hop quote function
        console.log(
          `🔄 Calculating multi-hop quote: ${route.path.map((t) => t.code).join(' → ')}`,
        )

        const path = route.path.map((token) => token.contract)
        const fees = route.fees

        console.log(`Path: ${path.join(' → ')}`)
        console.log(`Fees: ${fees.join(', ')}`)
        console.log(`Amount in: ${amountIn}`)

        const quote = await quoteService.getQuoteExactInput({
          path: path,
          fees: fees,
          amountIn: amountIn,
        })

        if (!quote) {
          console.error('❌ Multi-hop quote returned null')
          return '0'
        }

        console.log(
          `✅ Multi-hop quote complete: ${amountIn} → ${quote.amountOut}`,
        )
        return quote.amountOut.toString()
      }
    },
    onSuccess: (_result) => {
      // Quote executed successfully
    },
    onError: (_error) => {
      // Quote failed - handled gracefully
    },
  })
}
