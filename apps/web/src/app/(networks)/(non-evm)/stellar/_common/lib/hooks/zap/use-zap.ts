'use client'

import * as StellarSdk from '@stellar/stellar-sdk'
import {
  createErrorToast,
  createInfoToast,
  createSuccessToast,
} from '@sushiswap/notifications'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMinutes } from 'date-fns'
import { ChainId } from 'sushi'
import type { RouteWithTokens } from '~stellar/swap/lib/swap-get-route'
import { calculateAmountOutMinimum } from '../../services/router-service'
import { DEFAULT_TIMEOUT, contractAddresses } from '../../soroban'
import { getZapRouterContractClient } from '../../soroban/client'
import {
  type AssembledTransactionLike,
  signAuthEntriesAndGetXdr,
  submitViaRawRPC,
  waitForTransaction,
} from '../../soroban/rpc-transaction-helpers'
import type { Token } from '../../types/token.type'
import { extractErrorMessage } from '../../utils/error-helpers'
import { getStellarTxnLink } from '../../utils/stellarchain-helpers'

export interface UseZapParams {
  poolAddress: string
  tokenIn: Token
  amountIn: string
  tokenInDecimals: number
  token0: Token
  token1: Token
  tickLower: number
  tickUpper: number
  slippage?: number
  userAddress: string
  signTransaction: (xdr: string) => Promise<string>
  signAuthEntry: (entryPreimageXdr: string) => Promise<string>
  routeToken0: RouteWithTokens | null
  routeToken1: RouteWithTokens | null
}

export const useZap = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['stellar', 'zap'],
    onMutate: async (params: UseZapParams) => {
      const timestamp = Date.now()
      createInfoToast({
        summary: 'Adding Liquidity...',
        type: 'mint',
        account: params.userAddress,
        chainId: ChainId.STELLAR,
        groupTimestamp: timestamp,
        timestamp,
      })
    },
    mutationFn: async (_params: UseZapParams) => {
      throw new Error(
        'Zapping liquidity is currently disabled for maintenance. Please check back later.',
      )
      // const {
      //   poolAddress,
      //   tokenIn,
      //   amountIn,
      //   tokenInDecimals,
      //   tickLower,
      //   tickUpper,
      //   slippage = 0.005,
      //   userAddress,
      //   signTransaction,
      //   signAuthEntry,
      //   routeToken0,
      //   routeToken1,
      //   token0,
      //   token1,
      // } = params

      // const isZapTokenToken0 =
      //   tokenIn.contract.toUpperCase() === token0.contract.toUpperCase()
      // const isZapTokenToken1 =
      //   tokenIn.contract.toUpperCase() === token1.contract.toUpperCase()

      // if (!routeToken0 && !isZapTokenToken0) {
      //   throw new Error(`No route from ${tokenIn.code} to ${token0.code}`)
      // }
      // if (!routeToken1 && !isZapTokenToken1) {
      //   throw new Error(`No route from ${tokenIn.code} to ${token1.code}`)
      // }

      // const amountInBigInt = BigInt(
      //   Math.floor(Number.parseFloat(amountIn) * 10 ** tokenInDecimals),
      // )

      // const zapRouterClient = getZapRouterContractClient({
      //   contractId: contractAddresses.ZAP_ROUTER,
      //   publicKey: userAddress,
      // })

      // const { result: zapQuoteResult } = await zapRouterClient.quote_zap_in(
      //   {
      //     params: {
      //       amount_in: amountInBigInt,
      //       fees_to_token0: routeToken0?.fees ?? [],
      //       fees_to_token1: routeToken1?.fees ?? [],
      //       pool: poolAddress,
      //       token_in: tokenIn.contract,
      //       path_to_token0: routeToken0?.route ?? [],
      //       path_to_token1: routeToken1?.route ?? [],
      //       tick_lower: tickLower,
      //       tick_upper: tickUpper,
      //     },
      //   },
      //   {
      //     timeoutInSeconds: DEFAULT_TIMEOUT,
      //   },
      // )

      // if (zapQuoteResult.isErr()) {
      //   throw new Error(
      //     `Error getting zap quote: ${zapQuoteResult.unwrapErr().message}`,
      //   )
      // }

      // const zapQuote = zapQuoteResult.unwrap()

      // const assembledTransaction = await zapRouterClient.zap_in(
      //   {
      //     params: {
      //       amount0_min: calculateAmountOutMinimum(zapQuote.amount0, slippage),
      //       amount1_min: calculateAmountOutMinimum(zapQuote.amount1, slippage),
      //       amount_in: amountInBigInt,
      //       deadline: BigInt(
      //         Math.floor(addMinutes(new Date(), 5).valueOf() / 1000),
      //       ),
      //       fees_to_token0: routeToken0?.fees ?? [],
      //       fees_to_token1: routeToken1?.fees ?? [],
      //       min_liquidity: calculateAmountOutMinimum(
      //         zapQuote.liquidity,
      //         slippage,
      //       ),
      //       path_to_token0: routeToken0?.route ?? [],
      //       path_to_token1: routeToken1?.route ?? [],
      //       pool: poolAddress,
      //       recipient: userAddress,
      //       sender: userAddress,
      //       swap_amount_hint:
      //         isZapTokenToken0 || isZapTokenToken1
      //           ? zapQuote.swap_amount
      //           : undefined,
      //       swap_to_token0_min_out: 0n,
      //       swap_to_token1_min_out: 0n,
      //       tick_lower: tickLower,
      //       tick_upper: tickUpper,
      //       token_in: tokenIn.contract,
      //     },
      //   },
      //   {
      //     timeoutInSeconds: DEFAULT_TIMEOUT,
      //     fee: 100000,
      //     simulate: true, // Explicitly enable simulation to ensure footprint is properly set
      //   },
      // )

      // const simulationResult = assembledTransaction.simulation
      // if (
      //   simulationResult &&
      //   StellarSdk.rpc.Api.isSimulationError(simulationResult)
      // ) {
      //   throw new Error(extractErrorMessage(simulationResult.error))
      // }

      // // Sign auth entries for nested authorization (PM -> Pool -> Token transfers)
      // // This is required because the user is not the direct invoker of pool.increase_liquidity
      // const transactionXdr = await signAuthEntriesAndGetXdr(
      //   assembledTransaction as unknown as AssembledTransactionLike,
      //   userAddress,
      //   signAuthEntry,
      // )

      // // Sign the transaction envelope
      // const signedXdr = await signTransaction(transactionXdr)

      // // Submit the signed XDR directly via raw RPC
      // const txHash = await submitViaRawRPC(signedXdr)

      // // Wait for confirmation
      // const result = await waitForTransaction(txHash)

      // if (result.success) {
      //   return {
      //     txHash,
      //     userAddress,
      //   }
      // } else {
      //   console.error('Transaction failed:', result.error)
      //   throw new Error(`Transaction failed: ${JSON.stringify(result.error)}`)
      // }
    },
    onSuccess: ({ txHash, userAddress }) => {
      const timestamp = Date.now()
      createSuccessToast({
        summary: 'Liquidity added successfully',
        type: 'mint',
        account: userAddress,
        chainId: ChainId.STELLAR,
        txHash: txHash,
        href: getStellarTxnLink(txHash),
        groupTimestamp: timestamp,
        timestamp,
      })

      // Invalidate queries
      queryClient.invalidateQueries({
        queryKey: ['stellar', 'pool', 'balances'],
      })
      queryClient.invalidateQueries({ queryKey: ['stellar', 'pool', 'info'] })
      queryClient.invalidateQueries({ queryKey: ['stellar', 'positions'] })
      queryClient.invalidateQueries({ queryKey: ['stellar', 'position-pool'] })
    },
    onError: (error) => {
      console.error('Add liquidity failed:', error)
      const errorMessage = extractErrorMessage(error)
      createErrorToast(errorMessage, false)
    },
  })
}
