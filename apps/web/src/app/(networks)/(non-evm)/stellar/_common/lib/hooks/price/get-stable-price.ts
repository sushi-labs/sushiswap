import { QuoteService } from '~stellar/_common/lib/services/quote-service'
import { getStableTokens } from '~stellar/_common/lib/soroban'
import { findBestPath } from '~stellar/_common/lib/soroban/dex-router-helpers'
import type { Token } from '~stellar/_common/lib/types/token.type'
import { formatTokenAmount } from '~stellar/_common/lib/utils/format'

// This implementation checks direct routes and 2-hop routes via XLM
// for parity with Tron implementation using findBestPath
const getTokenPriceDirectOrViaXlm = async (token?: Token): Promise<string> => {
  try {
    if (!token) return '0'

    if (token.isStable) {
      return '1'
    }

    const routesToStable = (
      await Promise.all(
        getStableTokens().map((stableToken) => {
          // We could use getBestRoute instead of findBestPath to enable
          // searching for routes with additional hops
          return findBestPath(token, stableToken)
        }),
      )
    ).filter((route): route is NonNullable<typeof route> => route !== null)

    // No routes exist
    if (routesToStable.length === 0) {
      return '0'
    }

    const quoteService = new QuoteService()
    const amountInForQuote = BigInt(10 ** token.decimals) // 1 unit of the token

    const quotePromises = routesToStable.map(async (route) => {
      const quote =
        route.type === 'direct'
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
    return formatTokenAmount(
      BigInt(
        maxOutputAmountWithoutFees.totalAmountOut +
          maxOutputAmountWithoutFees.feeAmountOut,
      ),
      maxOutputAmountWithoutFees.outputToken.decimals,
    )
  } catch (error) {
    console.log(error)
    return '0'
  }
}

export const getStablePrice = async (token?: Token): Promise<string> => {
  const tokenPrice = await getTokenPriceDirectOrViaXlm(token)
  return tokenPrice
}
