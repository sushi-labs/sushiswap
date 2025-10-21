import * as StellarSdk from '@stellar/stellar-sdk'
import type { UserPositionInfo } from '@sushiswap/stellar-contract-binding-position-manager'
import {
  getFactoryContractClient,
  getPoolContractClient,
  getPositionManagerContractClient,
} from '../soroban/client'
import { DEFAULT_TIMEOUT } from '../soroban/constants'
import {
  CONTRACT_ADDRESSES,
  NETWORK_CONFIG,
} from '../soroban/contract-addresses'
import {
  submitViaRawRPC,
  waitForTransaction,
} from '../soroban/rpc-transaction-helpers'

export interface PositionInfo {
  tokenId: number
  token0: string
  token1: string
  tickLower: number
  tickUpper: number
  liquidity: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  nonce: bigint
  operator: string
  fee: number
}

export interface CollectParams {
  tokenId: number
  recipient: string
  amount0Max: bigint
  amount1Max: bigint
}

export interface CollectResult {
  amount0: bigint
  amount1: bigint
  txHash: string
}

const formatPositionInfo = (
  contractPositionInfo: UserPositionInfo,
): PositionInfo => {
  return {
    tokenId: contractPositionInfo.token_id,
    token0: contractPositionInfo.token0,
    token1: contractPositionInfo.token1,
    tickLower: contractPositionInfo.tick_lower,
    tickUpper: contractPositionInfo.tick_upper,
    liquidity: contractPositionInfo.liquidity,
    tokensOwed0: contractPositionInfo.tokens_owed0,
    tokensOwed1: contractPositionInfo.tokens_owed1,
    feeGrowthInside0LastX128: contractPositionInfo.fee_growth_inside0_last_x128,
    feeGrowthInside1LastX128: contractPositionInfo.fee_growth_inside1_last_x128,
    nonce: contractPositionInfo.nonce,
    operator: contractPositionInfo.operator,
    fee: contractPositionInfo.fee,
  }
}

/**
 * Service for managing positions and collecting fees on Stellar
 */
export class PositionService {
  /**
   * Get all position token IDs owned by a user
   */
  async getUserTokenIds(
    userAddress: string,
    skip = 0,
    take = 100,
  ): Promise<number[]> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    const result = await positionManagerClient.get_user_token_ids({
      owner: userAddress,
      skip,
      take,
    })

    return result.result || []
  }

  /**
   * Get a single position with live fee calculations
   */
  async getPositionWithFees(tokenId: number): Promise<PositionInfo | null> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const { result } = await positionManagerClient.get_position_with_fees({
        token_id: tokenId,
      })

      return formatPositionInfo(result)
    } catch (error) {
      console.error(`Failed to get position ${tokenId}:`, error)
      return null
    }
  }

  /**
   * Get multiple positions with live fee calculations
   */
  async getPositionsWithFees(tokenIds: number[]): Promise<PositionInfo[]> {
    if (tokenIds.length === 0) return []

    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const { result } = await positionManagerClient.get_positions_with_fees({
        token_ids: tokenIds,
      })

      return result.map(formatPositionInfo)
    } catch (error) {
      console.error('Failed to get positions with fees:', error)
      return []
    }
  }

  /**
   * Get all positions owned by a user with live fee calculations
   */
  async getUserPositionsWithFees(
    userAddress: string,
    skip = 0,
    take = 100,
  ): Promise<PositionInfo[]> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const { result } =
        await positionManagerClient.get_user_positions_with_fees({
          owner: userAddress,
          skip,
          take,
        })

      const formattedResults = result.map(formatPositionInfo)

      console.log('📊 Positions found:', formattedResults.length || 0)

      if (result.length > 0) {
        formattedResults.forEach((pos, i) => {
          console.log(`Position ${i}:`, {
            tokenId: pos.tokenId,
            token0: pos.token0,
            token1: pos.token1,
            liquidity: pos.liquidity.toString(),
            feesToken0: pos.tokensOwed0.toString(),
            feesToken1: pos.tokensOwed1.toString(),
          })
        })
      }

      return formattedResults
    } catch (error) {
      console.error('❌ Failed to get user positions with fees:', error)
      if (error instanceof Error) {
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      return []
    }
  }

  /**
   * Get the principal token amounts for a position
   * This calculates the actual token0 and token1 amounts from liquidity
   */
  async getPositionPrincipal(
    tokenId: number,
  ): Promise<{ amount0: bigint; amount1: bigint }> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const position = await positionManagerClient.get_position_with_fees({
        token_id: tokenId,
      })

      const factoryClient = getFactoryContractClient({
        contractId: CONTRACT_ADDRESSES.FACTORY,
      })

      const poolAddress = await factoryClient.get_pool({
        token_a: position.result.token0,
        token_b: position.result.token1,
        fee: position.result.fee,
      })

      const poolClient = getPoolContractClient({
        contractId: poolAddress.result || '',
      })

      const slot0 = await poolClient.slot0()
      console.log(`📊 [getPositionPrincipal] Full slot0 result:`, slot0.result)

      // Handle field name confusion: the contract returns sqrt_price_x96 in the fee_protocol field
      let sqrtPriceX96: bigint

      if (
        slot0.result.sqrt_price_x96 &&
        Number(slot0.result.sqrt_price_x96) !== 0
      ) {
        sqrtPriceX96 = BigInt(slot0.result.sqrt_price_x96)
        console.log(
          `📊 [getPositionPrincipal] Using sqrt_price_x96 from correct field:`,
          sqrtPriceX96.toString(),
        )
      } else if (
        slot0.result.fee_protocol &&
        BigInt(slot0.result.fee_protocol) !== 0n
      ) {
        // The contract has the fields mixed up - sqrt price is in fee_protocol
        sqrtPriceX96 = BigInt(slot0.result.fee_protocol)
        console.log(
          `📊 [getPositionPrincipal] Using sqrt_price_x96 from fee_protocol field (field names are swapped):`,
          sqrtPriceX96.toString(),
        )
      } else {
        console.warn(
          'Pool sqrt_price_x96 is 0 - cannot calculate principal amounts',
        )
        return { amount0: 0n, amount1: 0n }
      }

      console.log(
        `📊 [getPositionPrincipal] Final sqrt_price_x96:`,
        sqrtPriceX96.toString(),
      )

      const result = await positionManagerClient.position_principal({
        token_id: tokenId,
        sqrt_price_x96: sqrtPriceX96,
      })

      return {
        amount0: BigInt(result.result[0]),
        amount1: BigInt(result.result[1]),
      }
    } catch (error) {
      console.error(
        `Failed to get position principal for token ${tokenId}:`,
        error,
      )
      return { amount0: 0n, amount1: 0n }
    }
  }

  /**
   * Collect fees from a position
   */
  async collectFees(
    params: CollectParams,
    signTransaction: (xdr: string) => Promise<string>,
  ): Promise<CollectResult> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
      publicKey: params.recipient,
    })

    console.log('Preparing collect transaction for position:', params.tokenId)

    const assembledTransaction = await positionManagerClient.collect(
      {
        params: {
          token_id: params.tokenId,
          recipient: params.recipient,
          amount0_max: params.amount0Max,
          amount1_max: params.amount1Max,
          operator: params.recipient,
        },
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100000,
      },
    )

    console.log('Transaction prepared. Waiting for wallet signature...')

    // Convert to XDR for signing
    const transactionXdr = assembledTransaction.toXDR()

    // Sign the transaction
    const signedXdr = await signTransaction(transactionXdr)
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      NETWORK_CONFIG.PASSPHRASE,
    )

    console.log('Transaction signed. Submitting to network...')

    // Submit the signed transaction via raw RPC
    const txHash = await submitViaRawRPC(signedTx)

    console.log(`Transaction submitted: ${txHash}`)
    console.log('Waiting for confirmation...')

    // Wait for confirmation
    const result = await waitForTransaction(txHash)

    if (result.success) {
      console.log('✅ Fee collection confirmed!')
      console.log('📊 Full result data:', result.data)

      // TODO: Parse return value when we understand the response structure
      // For now, return placeholder values - fees are collected on-chain

      return {
        amount0: BigInt(0),
        amount1: BigInt(0),
        txHash,
      }
    } else {
      console.error('Transaction failed:', result.error)
      throw new Error(`Fee collection failed: ${JSON.stringify(result.error)}`)
    }
  }

  /**
   * Calculate uncollected fees for a position
   * Uses position_fees which calculates live fees from the pool
   */
  async getUncollectedFees(
    tokenId: number,
  ): Promise<{ fees0: bigint; fees1: bigint } | null> {
    const positionManagerClient = getPositionManagerContractClient({
      contractId: CONTRACT_ADDRESSES.POSITION_MANAGER,
    })

    try {
      const result = await positionManagerClient.position_fees({
        token_id: tokenId,
      })

      const fees = result.result
      return {
        fees0: fees[0],
        fees1: fees[1],
      }
    } catch (error) {
      console.error(
        `Failed to get uncollected fees for position ${tokenId}:`,
        error,
      )
      return null
    }
  }
}

// Export a singleton instance
export const positionService = new PositionService()
