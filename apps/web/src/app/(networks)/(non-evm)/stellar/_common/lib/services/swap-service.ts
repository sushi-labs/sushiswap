import * as StellarSdk from '@stellar/stellar-sdk'
import { DEFAULT_TIMEOUT } from '@stellar/stellar-sdk/contract'
import { getRouterContractClient } from '../soroban/client'
import {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from '../soroban/contract-addresses'
import { tickToSqrtPrice } from '../soroban/pool-helpers'
import {
  submitViaRawRPC,
  waitForTransaction,
} from '../soroban/rpc-transaction-helpers'
import { extractErrorMessage } from '../utils/error-helpers'

/**
 * Parameters for adding liquidity
 */
export interface AddLiquidityParams {
  poolAddress: string
  token0Amount: string
  token1Amount: string
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
  private networkPassphrase: string
  private horizonUrl: string
  private sorobanRpcUrl: string

  constructor() {
    this.networkPassphrase = NETWORK_CONFIG.PASSPHRASE
    this.horizonUrl = NETWORK_CONFIG.HORIZON_URL
    this.sorobanRpcUrl = NETWORK_CONFIG.SOROBAN_URL
  }

  /**
   * Execute a single-hop swap (exactly like stellar-auth-test)
   */
  async swapExactInputSingle(
    userAddress: string,
    params: SwapExactInputSingleParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<{ txHash: string; amountOut: bigint }> {
    const routerContractClient = getRouterContractClient({
      contractId: CONTRACT_ADDRESSES.ROUTER,
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

    // Sign the transaction - use the built transaction
    const unsignedXdr = assembledTransaction.toXDR()
    const signedXdr = await signTransaction(unsignedXdr)

    // Submit the signed XDR directly via raw RPC
    const txHash = await submitViaRawRPC(signedXdr)

    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        txHash,
        amountOut: BigInt(params.amountOutMinimum),
      }
    } else {
      throw new Error(extractErrorMessage(result.error))
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
    const routerContractClient = getRouterContractClient({
      contractId: CONTRACT_ADDRESSES.ROUTER,
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

    // Sign the transaction
    const unsignedXdr = assembledTransaction.toXDR()
    const signedXdr = await signTransaction(unsignedXdr)

    // Submit the signed XDR directly via raw RPC (same as single-hop)
    const txHash = await submitViaRawRPC(signedXdr)
    const result = await waitForTransaction(txHash)

    if (result.success) {
      return {
        txHash,
        amountOut: BigInt(params.amountOutMinimum),
      }
    } else {
      throw new Error(extractErrorMessage(result.error))
    }
  }
}
