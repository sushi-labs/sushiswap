import { formatUnits } from 'viem'
import { QuoteService } from '~stellar/_common/lib/services/quote-service'
import { getStableTokens } from '~stellar/_common/lib/soroban'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { SushiStellarService } from '../../services'

const service = new SushiStellarService()

const quoteService = new QuoteService()

// This implementation checks the price of a token against stable tokens available with
// the route found by findBestRoute in the SushiStellarService
const getTokenPrice = async (token?: Token): Promise<string> => {
  try {
    if (!token) return '0'

    if (token.isStable) {
      return '1'
    }

    const amountInForQuote = BigInt(10 ** token.decimals) // 1 unit of the token

    const routesToStable = (
      await Promise.all(
        getStableTokens().map((stableToken) => {
          // Find best route to each stable token with 1 unit of the token
          return service.findBestRoute(token, stableToken, amountInForQuote)
        }),
      )
    ).filter((route): route is NonNullable<typeof route> => route !== null)

    // No routes exist
    if (routesToStable.length === 0) {
      return '0'
    }

    const quotePromises = routesToStable.map(async (route) => {
      const quote =
        route.routeType === 'direct'
          ? await quoteService.getQuoteExactInputSingle({
              tokenIn: route.path[0].contract,
              tokenOut: route.path[1].contract,
              fee: route.fees[0],
              amountIn: amountInForQuote,
              sqrtPriceLimitX96: undefined,
            })
          : await quoteService.getQuoteExactInput({
              path: route.path.map((t) => t.contract),
              fees: route.fees,
              amountIn: amountInForQuote,
            })
      if (!quote) {
        throw new Error('No quote returned for direct route')
      }
      return {
        quote,
        outputToken: route.path[route.path.length - 1],
      }
    })

    const quotes = (await Promise.allSettled(quotePromises))
      .map((result) => {
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          console.warn('Quote retrieval failed for a route:', result.reason)
          return null
        }
      })
      .filter((quote): quote is NonNullable<typeof quote> => quote !== null)

    if (quotes.length === 0) {
      throw new Error('No valid quotes retrieved for any route')
    }

    const outputAmounts: Array<{
      totalAmountOut: bigint
      feeAmountOut: bigint
      outputToken: Token
    }> = quotes.map(({ quote, outputToken }) => {
      const totalAmountOut = quote.amountOut
      const feeFactors = quote.fees.map((fee) => {
        return (1000000 - fee) / 1000000
      })
      const totalFeeFactor = feeFactors.reduce((acc, factor) => acc * factor, 1)
      const amountOutWithoutFees = BigInt(
        Math.floor(Number(totalAmountOut) / totalFeeFactor),
      )
      const feeAmountOut = amountOutWithoutFees - totalAmountOut
      return {
        totalAmountOut,
        feeAmountOut,
        outputToken,
      }
    })
    const maxOutputAmountWithoutFees = outputAmounts.reduce((prev, curr) => {
      return curr.totalAmountOut + curr.feeAmountOut >
        prev.totalAmountOut + prev.feeAmountOut
        ? curr
        : prev
    })
    return formatUnits(
      maxOutputAmountWithoutFees.totalAmountOut +
        maxOutputAmountWithoutFees.feeAmountOut,

      maxOutputAmountWithoutFees.outputToken.decimals,
    )
  } catch (error) {
    console.error('Failed to get stable price', error)
    return '0'
  }
}

export const getStablePrice = async (token?: Token): Promise<string> => {
  const tokenPrice = await getTokenPrice(token)
  return tokenPrice
}
