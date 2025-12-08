import * as StellarSdk from '@stellar/stellar-sdk'
import { scValToBigInt } from '@stellar/stellar-sdk'
import { DEFAULT_TIMEOUT } from '@stellar/stellar-sdk/contract'
import { sub } from 'date-fns'
import { contractAddresses } from '../soroban'
import { getRouterContractClient } from '../soroban/client'
import {
  submitTransaction,
  waitForTransaction,
} from '../soroban/transaction-helpers'
import { extractErrorMessage } from '../utils/error-helpers'

/**
 * Parameters for adding liquidity
 */
export interface AddLiquidityParams {
  poolAddress: string
  token0Amount: string
  token1Amount: string
  token0Decimals: number
  token1Decimals: number
  tickLower: number
  tickUpper: number
  recipient?: string
  deadline?: number
}

/**
 * Parameters for single-hop swap
 */
export interface SwapExactInputSingleParams {
  tokenIn: string
  tokenOut: string
  fee: number
  recipient: string
  deadline: number
  amountIn: bigint
  amountOutMinimum: bigint
  sqrtPriceLimitX96?: bigint
}

/**
 * Parameters for multi-hop swap
 */
export interface SwapExactInputParams {
  path: string[]
  fees: number[]
  recipient: string
  deadline: number
  amountIn: bigint
  amountOutMinimum: bigint
}

/**
 * Swap quote result
 */
export interface SwapQuote {
  amountOut: bigint
  path: string[]
  fees: number[]
  priceImpact: number
  routeType: 'direct' | 'multihop'
}

/**
 * Service for executing swaps and liquidity operations on Stellar
 */
export class SwapService {
  /**
   * Execute a single-hop swap (exactly like stellar-auth-test)
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    try {
      const routerContractClient = getRouterContractClient({
        contractId: contractAddresses.ROUTER,
        publicKey: userAddress,
      })

      const assembledTransaction = await routerContractClient.swap_exact_input(
        {
          params: {
            sender: userAddress,
            path: [params.tokenIn, params.tokenOut],
            fees: [params.fee],
            recipient: params.recipient,
            amount_in: params.amountIn,
            amount_out_minimum: params.amountOutMinimum,
            deadline: BigInt(params.deadline),
          },
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
        },
      )

      const simulationResult = assembledTransaction.simulation
      if (
        simulationResult &&
        StellarSdk.rpc.Api.isSimulationError(simulationResult)
      ) {
        throw new Error(extractErrorMessage(simulationResult.error))
      }

      // Sign the transaction - use the built transaction
      const unsignedXdr = assembledTransaction.toXDR()
      const signedXdr = await signTransaction(unsignedXdr)

      // Submit the signed XDR directly via raw RPC
      const { hash: txHash } = await submitTransaction(signedXdr)

      const txResult = await waitForTransaction(txHash)

      if (txResult.status === 'SUCCESS' && txResult.returnValue !== undefined) {
        // Extract output amount from return value
        const amountOut = scValToBigInt(txResult.returnValue)
        return {
          txHash: txHash,
          amountOut: amountOut,
        }
      } else {
        throw new Error(`Transaction ${txHash} ${txResult.status}`)
      }
    } catch (error) {
      console.error('❌ Error in swapExactInputSingle', error)
      throw error
    }
  }

  /**
   * Execute a multi-hop swap (exactly like stellar-auth-test)
   */
  async swapExactInput(
    userAddress: string,
    params: SwapExactInputParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    try {
      const routerContractClient = getRouterContractClient({
        contractId: contractAddresses.ROUTER,
        publicKey: userAddress,
      })
      // Ensure fees are proper u32 numbers (not bigints)
      const feesAsNumbers = params.fees.map((fee) => Number(fee))

      const assembledTransaction = await routerContractClient.swap_exact_input(
        {
          params: {
            sender: userAddress,
            path: params.path,
            fees: feesAsNumbers,
            recipient: params.recipient,
            amount_in: params.amountIn,
            amount_out_minimum: params.amountOutMinimum,
            deadline: BigInt(params.deadline),
          },
        },
        {
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100000,
        },
      )
      const simulationResult = assembledTransaction.simulation
      if (
        simulationResult &&
        StellarSdk.rpc.Api.isSimulationError(simulationResult)
      ) {
        throw new Error(extractErrorMessage(simulationResult.error))
      }

      // Sign the transaction
      const unsignedXdr = assembledTransaction.toXDR()
      const signedXdr = await signTransaction(unsignedXdr)

      // Submit the signed XDR directly via raw RPC (same as single-hop)
      const { hash: txHash } = await submitTransaction(signedXdr)

      const txResult = await waitForTransaction(txHash)

      if (txResult.status === 'SUCCESS' && txResult.returnValue !== undefined) {
        // Extract output amount from return value
        const amountOut = scValToBigInt(txResult.returnValue)
        return {
          txHash: txHash,
          amountOut: amountOut,
        }
      } else {
        throw new Error(`Transaction ${txHash} ${txResult.status}`)
      }
    } catch (error) {
      console.error('❌ Error in swapExactInput', error)
      throw error
    }
  }
}
