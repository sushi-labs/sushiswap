import {
  Address,
  Operation,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk'
import { tokens } from '../assets/token-assets'
import { NETWORK_NAME, NETWORK_PASSPHRASE, RPC_URL } from '../constants'
import type { Token } from '../types/token.type'
import { SorobanClient } from './client'
import { DEFAULT_TIMEOUT, SIMULATION_ACCOUNT } from './constants'
import { CONTRACT_ADDRESSES } from './contract-addresses'

/**
 * Gets the tokens without any alteration
 * @returns An array of Tokens
 */
export function getBaseTokens(): Token[] {
  const baseTokens: Token[] = tokens[NETWORK_NAME]
  return baseTokens
}

/**
 * Get a token by its code
 * @param code - The code of the token
 * @returns A Token object
 */
export function getTokenByCode(code: string): Token | undefined {
  return tokens[NETWORK_NAME].find((token) => token.code === code)
}

/**
 * Get the balance of a token for an address
 * @param address - The address to get the balance of
 * @param tokenAddress - The token contract address
 * @returns The balance of the address
 */
export async function getTokenBalance(
  address: string,
  tokenAddress: string,
): Promise<bigint> {
  try {
    const balanceTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: tokenAddress,
          function: 'balance',
          args: [Address.fromString(address).toScVal()],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // Simulate and parse results
    const result = await SorobanClient.simulateTransaction(balanceTx)

    // Check for errors first
    if ('error' in result) {
      console.error('Simulation error:', result.error)
      return 0n
    }

    if ('result' in result && result.result) {
      const simResult = result.result as any

      // The retval contains the ScVal data directly
      if (simResult.retval) {
        // Check if it's a u128 or i128 ScVal
        if (
          (simResult.retval._switch?.name === 'scvU128' &&
            simResult.retval._arm === 'u128') ||
          (simResult.retval._switch?.name === 'scvI128' &&
            simResult.retval._arm === 'i128')
        ) {
          const balance = simResult.retval._value._attributes.lo._value
          return BigInt(balance)
        }
      }
    }
    return 0n
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return 0n
  }
}

/**
 * Get the balance of a token for an address using Token object
 * @param address - The address to get the balance of
 * @param token - The token object
 * @returns The balance of the address
 */
export async function getTokenBalanceFromToken(
  address: string,
  token: Token,
): Promise<bigint> {
  return getTokenBalance(address, token.contract)
}

/**
 * Get the allowance for a token
 * @param owner - The owner address
 * @param spender - The spender address
 * @param tokenAddress - The token contract address
 * @returns The allowance amount
 */
export async function getTokenAllowance(
  owner: string,
  spender: string,
  tokenAddress: string,
): Promise<bigint> {
  try {
    const allowanceTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: tokenAddress,
          function: 'allowance',
          args: [
            Address.fromString(owner).toScVal(),
            Address.fromString(spender).toScVal(),
          ],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // Simulate and parse results
    const result = await SorobanClient.simulateTransaction(allowanceTx)
    if ('result' in result && result.result) {
      const simResult = result.result as any

      // The retval contains the ScVal data directly
      if (simResult.retval) {
        // Check if it's a u128 or i128 ScVal
        if (
          (simResult.retval._switch?.name === 'scvU128' &&
            simResult.retval._arm === 'u128') ||
          (simResult.retval._switch?.name === 'scvI128' &&
            simResult.retval._arm === 'i128')
        ) {
          const allowance = simResult.retval._value._attributes.lo._value
          return BigInt(allowance)
        }
      }
    }
    return 0n
  } catch (error) {
    console.error('Error fetching token allowance:', error)
    return 0n
  }
}

/**
 * Approve a spender to spend tokens
 * @param spender - The spender address
 * @param amount - The amount to approve
 * @param tokenAddress - The token contract address
 * @returns The approval result
 */
export async function approveToken(
  spender: string,
  amount: bigint,
  tokenAddress: string,
): Promise<any> {
  try {
    const approveTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: tokenAddress,
          function: 'approve',
          args: [
            Address.fromString(spender).toScVal(),
            Address.fromString(spender).toScVal(),
            xdr.ScVal.scvI64(xdr.Int64.fromString(amount.toString())),
            xdr.ScVal.scvU32(535680), // ~30 days in ledgers
          ],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // For write operations, we return the transaction to be submitted
    return approveTx
  } catch (error) {
    console.error('Error creating approve transaction:', error)
    throw error
  }
}

/**
 * Transfer tokens to another address
 * @param to - The recipient address
 * @param amount - The amount to transfer
 * @param tokenAddress - The token contract address
 * @returns The transfer result
 */
export async function transferToken(
  to: string,
  amount: bigint,
  tokenAddress: string,
): Promise<any> {
  try {
    const transferTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: tokenAddress,
          function: 'transfer',
          args: [
            Address.fromString(to).toScVal(), // This would need to be the actual sender address
            Address.fromString(to).toScVal(),
            xdr.ScVal.scvI64(xdr.Int64.fromString(amount.toString())),
          ],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // For write operations, we return the transaction to be submitted
    return transferTx
  } catch (error) {
    console.error('Error creating transfer transaction:', error)
    throw error
  }
}

/**
 * Transfer tokens from one address to another (requires allowance)
 * @param from - The sender address
 * @param to - The recipient address
 * @param amount - The amount to transfer
 * @param tokenAddress - The token contract address
 * @returns The transfer result
 */
export async function transferFromToken(
  from: string,
  to: string,
  amount: bigint,
  tokenAddress: string,
): Promise<any> {
  try {
    const transferFromTx = new TransactionBuilder(SIMULATION_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.invokeContractFunction({
          contract: tokenAddress,
          function: 'transfer_from',
          args: [
            Address.fromString(from).toScVal(), // This would need to be the actual spender address
            Address.fromString(from).toScVal(),
            Address.fromString(to).toScVal(),
            xdr.ScVal.scvI64(xdr.Int64.fromString(amount.toString())),
          ],
        }),
      )
      .setTimeout(DEFAULT_TIMEOUT)
      .build()

    // For write operations, we return the transaction to be submitted
    return transferFromTx
  } catch (error) {
    console.error('Error creating transferFrom transaction:', error)
    throw error
  }
}

/**
 * Get token metadata
 * @param tokenAddress - The token contract address
 * @returns Token metadata
 */
export async function getTokenMetadata(tokenAddress: string): Promise<{
  name: string
  symbol: string
  decimals: number
  totalSupply: bigint
}> {
  try {
    // Helper function to simulate contract call and extract result
    const simulateContractCall = async (
      functionName: string,
      args: any[] = [],
    ) => {
      const tx = new TransactionBuilder(SIMULATION_ACCOUNT, {
        fee: '100',
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.invokeContractFunction({
            contract: tokenAddress,
            function: functionName,
            args: args,
          }),
        )
        .setTimeout(DEFAULT_TIMEOUT)
        .build()

      const result = await SorobanClient.simulateTransaction(tx)
      if ('result' in result && result.result) {
        const simResult = result.result as any
        if (simResult.retval) {
          // Handle different return types
          if (simResult.retval._switch?.name === 'scvString') {
            return simResult.retval._value
          } else if (simResult.retval._switch?.name === 'scvU32') {
            return simResult.retval._value
          }
        }
      }
      return null
    }

    const [nameResult, symbolResult, decimalsResult] = await Promise.all([
      simulateContractCall('name'),
      simulateContractCall('symbol'),
      simulateContractCall('decimals'),
    ])

    return {
      name: nameResult || '',
      symbol: symbolResult || '',
      decimals: decimalsResult || 0,
      totalSupply: 0n, // TODO(drew): This would need to be implemented based on the actual contract
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error)
    return {
      name: '',
      symbol: '',
      decimals: 0,
      totalSupply: 0n,
    }
  }
}

/**
 * Check if an address has sufficient token balance
 * @param address - The address to check
 * @param tokenAddress - The token contract address
 * @param requiredAmount - The required amount
 * @returns True if balance is sufficient, false otherwise
 */
export async function hasSufficientBalance(
  address: string,
  tokenAddress: string,
  requiredAmount: bigint,
): Promise<boolean> {
  const balance = await getTokenBalance(address, tokenAddress)
  return balance >= requiredAmount
}

/**
 * Check if an address has sufficient allowance
 * @param owner - The owner address
 * @param spender - The spender address
 * @param tokenAddress - The token contract address
 * @param requiredAmount - The required amount
 * @returns True if allowance is sufficient, false otherwise
 */
export async function hasSufficientAllowance(
  owner: string,
  spender: string,
  tokenAddress: string,
  requiredAmount: bigint,
): Promise<boolean> {
  const allowance = await getTokenAllowance(owner, spender, tokenAddress)
  return allowance >= requiredAmount
}

/**
 * Get multiple token balances for an address
 * @param address - The address to get balances for
 * @param tokenAddresses - Array of token contract addresses
 * @returns Object mapping token addresses to balances
 */
export async function getMultipleTokenBalances(
  address: string,
  tokenAddresses: string[],
): Promise<Record<string, bigint>> {
  const balancePromises = tokenAddresses.map(async (tokenAddress) => {
    const balance = await getTokenBalance(address, tokenAddress)
    return { tokenAddress, balance }
  })

  const results = await Promise.all(balancePromises)

  return results.reduce(
    (acc, { tokenAddress, balance }) => {
      acc[tokenAddress] = balance
      return acc
    },
    {} as Record<string, bigint>,
  )
}

/**
 * Get multiple token allowances for an address
 * @param owner - The owner address
 * @param spender - The spender address
 * @param tokenAddresses - Array of token contract addresses
 * @returns Object mapping token addresses to allowances
 */
export async function getMultipleTokenAllowances(
  owner: string,
  spender: string,
  tokenAddresses: string[],
): Promise<Record<string, bigint>> {
  const allowancePromises = tokenAddresses.map(async (tokenAddress) => {
    const allowance = await getTokenAllowance(owner, spender, tokenAddress)
    return { tokenAddress, allowance }
  })

  const results = await Promise.all(allowancePromises)

  return results.reduce(
    (acc, { tokenAddress, allowance }) => {
      acc[tokenAddress] = allowance
      return acc
    },
    {} as Record<string, bigint>,
  )
}

/**
 * Format token amount with decimals
 * @param amount - The amount in smallest units
 * @param decimals - The number of decimals
 * @returns Formatted amount as a string
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals)
  const wholePart = amount / divisor
  const fractionalPart = amount % divisor

  if (fractionalPart === 0n) {
    return wholePart.toString()
  }

  const fractionalStr = fractionalPart.toString().padStart(decimals, '0')
  const trimmedFractional = fractionalStr.replace(/0+$/, '')

  if (trimmedFractional === '') {
    return wholePart.toString()
  }

  return `${wholePart}.${trimmedFractional}`
}

/**
 * Parse token amount from string
 * @param amountStr - The amount as a string
 * @param decimals - The number of decimals
 * @returns Amount in smallest units
 */
export function parseTokenAmount(amountStr: string, decimals: number): bigint {
  const [wholePart, fractionalPart = ''] = amountStr.split('.')
  const paddedFractional = fractionalPart
    .padEnd(decimals, '0')
    .slice(0, decimals)
  const multiplier = BigInt(10 ** decimals)

  return BigInt(wholePart) * multiplier + BigInt(paddedFractional)
}

/**
 * Get test token addresses
 * @returns Object with test token addresses
 */
export function getTestTokenAddresses() {
  return {
    HYPEa: CONTRACT_ADDRESSES.TOKENS.HYPEA,
    HYPEb: CONTRACT_ADDRESSES.TOKENS.HYPEB,
    XLM: CONTRACT_ADDRESSES.TOKENS.XLM,
  }
}
