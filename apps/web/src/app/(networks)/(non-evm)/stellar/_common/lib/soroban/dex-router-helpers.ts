import { NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import type { Token } from '../types/token.type'
import { ZERO_ADDRESS } from './constants'
import { CONTRACT_ADDRESSES, getPoolConfig } from './contract-addresses'
import { getFees, getPool } from './dex-factory-helpers'
import { handleResult } from './handle-result'
import type { PoolBasicInfo } from './pool-helpers'
import { getTokenByCode } from './token-helpers'

interface Route {
  type: 'direct' | 'multihop'
  path: Token[]
  pools: PoolBasicInfo[]
  fees: number[]
}

// Find all pools between two tokens
export async function findPoolsBetweenTokens(
  tokenA: Token,
  tokenB: Token,
): Promise<PoolBasicInfo[]> {
  console.log('=== findPoolsBetweenTokens START ===')
  console.log('Looking for pools between:', tokenA.code, tokenB.code)

  const pools: PoolBasicInfo[] = []

  // Note: CONTRACT_ADDRESSES.POOLS is not defined in the current structure
  // Skip known pools lookup for now and go straight to dynamic discovery

  // Fall back to dynamic discovery
  console.log(`🔍 Checking fees: ${getFees().join(', ')}`)
  for (const fee of getFees()) {
    try {
      console.log(
        `🔍 Checking pool: ${tokenA.code}(${tokenA.contract}) ↔ ${tokenB.code}(${tokenB.contract}) with fee ${fee}`,
      )
      const pool = await getPool({
        tokenA: tokenA.contract,
        tokenB: tokenB.contract,
        fee,
      })
      if (pool) {
        pools.push({
          address: pool,
          tokenA: tokenA,
          tokenB: tokenB,
          fee: fee,
        })
        console.log(`✅ Found pool at ${pool} for fee ${fee}`)
      } else {
        console.log(`❌ No pool found for fee ${fee}`)
      }
    } catch (error) {
      // Pool doesn't exist for this fee tier
      console.warn(`Pool doesn't exist for fee tier ${fee}:`, error)
    }
  }

  console.log('=== findPoolsBetweenTokens END ===')
  console.log('Total pools found:', pools.length)
  return pools
}

// Find best path between tokens (direct or multi-hop)
export async function findBestPath(
  fromToken: Token,
  toToken: Token,
): Promise<Route | null> {
  console.log(`🚀 findBestPath called: ${fromToken.code} → ${toToken.code}`)

  // Step 1: Check for direct pool
  console.log(
    `🔍 Step 1: Checking direct route ${fromToken.code} → ${toToken.code}`,
  )
  const directPools = await findPoolsBetweenTokens(fromToken, toToken)
  console.log(`Direct pools found: ${directPools.length}`)

  if (directPools.length > 0) {
    // Use pool with lowest fee
    const bestPool = directPools.sort((a, b) => a.fee - b.fee)[0]
    console.log(`✅ Direct route found: ${fromToken.code} → ${toToken.code}`)
    return {
      type: 'direct',
      path: [fromToken, toToken],
      pools: [bestPool],
      fees: [bestPool.fee],
    }
  }

  console.log(`❌ No direct route found, trying multi-hop...`)

  // Step 2: Check multi-hop through XLM
  if (fromToken.code !== 'XLM' && toToken.code !== 'XLM') {
    const xlmToken = getTokenByCode('XLM')

    if (!xlmToken) return null

    console.log(
      `🔍 Trying multi-hop route: ${fromToken.code} → XLM → ${toToken.code}`,
    )

    const fromToXlm = await findPoolsBetweenTokens(fromToken, xlmToken)
    console.log(
      `Found ${fromToXlm.length} pools between ${fromToken.code} and XLM`,
    )

    const xlmToTo = await findPoolsBetweenTokens(xlmToken, toToken)
    console.log(`Found ${xlmToTo.length} pools between XLM and ${toToken.code}`)

    if (fromToXlm.length > 0 && xlmToTo.length > 0) {
      // Use pools with lowest fees
      const pool1 = fromToXlm.sort((a, b) => a.fee - b.fee)[0]
      const pool2 = xlmToTo.sort((a, b) => a.fee - b.fee)[0]

      console.log(
        `✅ Multi-hop route found: ${fromToken.code} → XLM → ${toToken.code}`,
      )
      console.log(`Pool 1: ${pool1.address} (fee: ${pool1.fee})`)
      console.log(`Pool 2: ${pool2.address} (fee: ${pool2.fee})`)

      return {
        type: 'multihop',
        path: [fromToken, xlmToken, toToken],
        pools: [pool1, pool2],
        fees: [pool1.fee, pool2.fee],
      }
    } else {
      console.log(
        `❌ Multi-hop route not possible: ${fromToken.code} → XLM → ${toToken.code}`,
      )
      console.log(`  ${fromToken.code} → XLM: ${fromToXlm.length} pools`)
      console.log(`  XLM → ${toToken.code}: ${xlmToTo.length} pools`)
    }
  }

  return null
}

export interface QuoteExactInputParams {
  userAddress?: string
  fromToken: Token
  toToken: Token
  amountIn: bigint
}

/**
 * Get a quote for exact input amount
 * @param address - The pool contract address
 * @param params - Quote parameters
 * @returns Quote result
 */
// TODO: Refactor to use Contract directly instead of Client
export async function quoteExactInput({
  userAddress: _userAddress = ZERO_ADDRESS,
  fromToken: _fromToken,
  toToken: _toToken,
  amountIn: _amountIn,
}: QuoteExactInputParams): Promise<{
  amount0: bigint
  amount1: bigint
}> {
  console.log(
    `💰 quoteExactInput called: ${_fromToken.code} → ${_toToken.code}`,
  )
  const route = await findBestPath(_fromToken, _toToken)
  console.log(`Route result:`, route)

  if (!route) {
    console.warn('No route found between tokens')
    return {
      amount0: 0n,
      amount1: 0n,
    }
  }

  // Log discovered route
  if (route.type === 'direct') {
    console.log(`Found direct pool with ${route.fees[0] / 10000}% fee`)
  } else {
    console.log(`Found multi-hop route through ${route.path[1].code}`)
    console.log(
      'info',
      `Fees: ${route.fees.map((f) => `${f / 10000}%`).join(' + ')}`,
    )
  }

  // TODO: Implement quote_exact_input using Contract class
  // const { result } = await DexRouterClient.quote_exact_input({
  //   params: {
  //     amount_in: amountIn,
  //     amount_out_minimum: 0n,
  //     sender: userAddress,
  //     recipient: userAddress,
  //     deadline: calculateDeadline(10),
  //     path: route.path.map((t) => t.contract),
  //     fees: route.fees,
  //   },
  // })
  // const quoteResult = handleResult(result as any) as any
  // console.log({ quoteResult })
  // Placeholder return - needs implementation
  return {
    amount0: 0n,
    amount1: 0n,
  }
}

/**
 * Get a quote for exact output amount
 * @param address - The pool contract address
 * @param params - Quote parameters
 * @returns Quote result
 */
// export async function quoteExactOutput({
//   address,
//   zeroForOne,
//   amountOut,
// }: {
//   address: string
//   zeroForOne: boolean
//   amountOut: bigint
// }): Promise<{
//   amount0: bigint
//   amount1: bigint
// }> {
//   const { result } = await DexRouterClient.quote_exact_output({
//     zero_for_one: zeroForOne,
//     amount_out: amountOut,
//     sqrt_price_limit_x96: 0n,
//   })
//   const quoteResult = handleResult(result as any) as any
//   return {
//     amount0: quoteResult[0] || 0n,
//     amount1: quoteResult[1] || 0n,
//   }
// }

export interface ExecuteSwapParams {
  amountIn: bigint
  amountOutMinimum: bigint
  deadline: number
  fee: number
  recipient: string
  sender: string
  sqrtPriceLimitX96: bigint
  tokenIn: string
  tokenOut: string
}

/**
 * Execute a single token swap
 * @param params - Swap parameters
 * @returns The result of the swap
 */
// TODO: Refactor to use Contract directly instead of Client
export async function executeSwap({
  amountIn: _amountIn,
  amountOutMinimum: _amountOutMinimum,
  deadline: _deadline,
  fee: _fee,
  recipient: _recipient,
  sender: _sender,
  sqrtPriceLimitX96: _sqrtPriceLimitX96,
  tokenIn: _tokenIn,
  tokenOut: _tokenOut,
}: ExecuteSwapParams): Promise<{
  amountIn: bigint
  amountOut: bigint
}> {
  // TODO: Implement swap_exact_input_single using Contract class
  // const { result } = await DexRouterClient.swap_exact_input_single({
  //   params: {
  //     amount_in: amountIn,
  //     amount_out_minimum: amountOutMinimum,
  //     deadline: calculateDeadline(deadline),
  //     fee: fee,
  //     recipient: recipient,
  //     sender: sender,
  //     sqrt_price_limit_x96: sqrtPriceLimitX96,
  //     token_in: tokenIn,
  //     token_out: tokenOut,
  //   },
  // })
  // return handleResult(result as any)
  // Placeholder return - needs implementation
  return { amountIn: _amountIn, amountOut: 0n }
}

/**
 * Execute a swap with exact output amount
 * @param params - Swap parameters
 * @returns The result of the swap
 */
// TODO: Refactor to use Contract directly instead of Client
export async function executeSwapExactOutput({
  amountInMaximum: _amountInMaximum,
  amountOut: _amountOut,
  deadline: _deadline,
  fee: _fee,
  recipient: _recipient,
  sender: _sender,
  sqrtPriceLimitX96: _sqrtPriceLimitX96,
  tokenIn: _tokenIn,
  tokenOut: _tokenOut,
}: {
  amountInMaximum: bigint
  amountOut: bigint
  deadline: number
  fee: number
  recipient: string
  sender: string
  sqrtPriceLimitX96: bigint
  tokenIn: string
  tokenOut: string
}): Promise<{
  amountIn: bigint
  amountOut: bigint
}> {
  // TODO: Implement swap_exact_output_single using Contract class
  // const { result } = await DexRouterClient.swap_exact_output_single({
  //   params: {
  //     amount_in_maximum: amountInMaximum,
  //     amount_out: amountOut,
  //     deadline: BigInt(deadline),
  //     fee: fee,
  //     recipient: recipient,
  //     sender: sender,
  //     sqrt_price_limit_x96: sqrtPriceLimitX96,
  //     token_in: tokenIn,
  //     token_out: tokenOut,
  //   },
  // })
  // return handleResult(result as any)
  // Placeholder return - needs implementation
  return { amountIn: 0n, amountOut: _amountOut }
}

/**
 * Execute a multi-hop swap with exact input
 * @param params - Multi-hop swap parameters
 * @returns The result of the swap
 */
// TODO: Refactor to use Contract directly instead of Client
export async function executeSwapExactInputMulti({
  amountIn: _amountIn,
  amountOutMinimum: _amountOutMinimum,
  deadline: _deadline,
  fees: _fees,
  path: _path,
  recipient: _recipient,
  sender: _sender,
}: {
  amountIn: bigint
  amountOutMinimum: bigint
  deadline: number
  fees: number[]
  path: string[]
  recipient: string
  sender: string
}): Promise<{
  amountIn: bigint
  amountOut: bigint
}> {
  // TODO: Implement swap_exact_input using Contract class
  // const { result } = await DexRouterClient.swap_exact_input({
  //   params: {
  //     amount_in: amountIn,
  //     amount_out_minimum: amountOutMinimum,
  //     deadline: BigInt(deadline),
  //     fees: fees,
  //     path: path,
  //     recipient: recipient,
  //     sender: sender,
  //   },
  // })
  // return handleResult(result as any)
  // Placeholder return - needs implementation
  return { amountIn: _amountIn, amountOut: 0n }
}

/**
 * Execute a multi-hop swap with exact output
 * @param params - Multi-hop swap parameters
 * @returns The result of the swap
 */
// TODO: Refactor to use Contract directly instead of Client
export async function executeSwapExactOutputMulti({
  amountInMaximum: _amountInMaximum,
  amountOut: _amountOut,
  deadline: _deadline,
  fees: _fees,
  path: _path,
  recipient: _recipient,
  sender: _sender,
}: {
  amountInMaximum: bigint
  amountOut: bigint
  deadline: number
  fees: number[]
  path: string[]
  recipient: string
  sender: string
}): Promise<{
  amountIn: bigint
  amountOut: bigint
}> {
  // TODO: Implement swap_exact_output using Contract class
  // const { result } = await DexRouterClient.swap_exact_output({
  //   params: {
  //     amount_in_maximum: amountInMaximum,
  //     amount_out: amountOut,
  //     deadline: BigInt(deadline),
  //     fees: fees,
  //     path: path,
  //     recipient: recipient,
  //     sender: sender,
  //   },
  // })
  // return handleResult(result as any)
  // Placeholder return - needs implementation
  return { amountIn: 0n, amountOut: _amountOut }
}

/**
 * Calculate the minimum amount out for a given slippage tolerance
 * @param amountOut - Expected amount out
 * @param slippageTolerance - Slippage tolerance as a percentage (e.g., 0.5 for 0.5%)
 * @returns Minimum amount out
 */
export function calculateAmountOutMinimum(
  amountOut: bigint,
  slippageTolerance: number,
): bigint {
  const slippageBps = Math.floor(slippageTolerance * 100) // Convert to basis points
  const slippageMultiplier = BigInt(10000 - slippageBps)
  return (amountOut * slippageMultiplier) / BigInt(10000)
}

/**
 * Calculate the maximum amount in for a given slippage tolerance
 * @param amountIn - Expected amount in
 * @param slippageTolerance - Slippage tolerance as a percentage
 * @returns Maximum amount in
 */
export function calculateAmountInMaximum(
  amountIn: bigint,
  slippageTolerance: number,
): bigint {
  const slippageBps = Math.floor(slippageTolerance * 100)
  const slippageMultiplier = BigInt(10000 + slippageBps)
  return (amountIn * slippageMultiplier) / BigInt(10000)
}

/**
 * Calculate deadline timestamp
 * @param minutesFromNow - Minutes from current time
 * @returns Deadline timestamp
 */
export function calculateDeadline(minutesFromNow = 20): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + minutesFromNow * 60)
}
