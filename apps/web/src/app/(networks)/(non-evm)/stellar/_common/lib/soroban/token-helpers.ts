import type { AssembledTransaction } from '@stellar/stellar-sdk/contract'
import { tokens } from '../assets/token-assets'
import { NETWORK_NAME } from '../constants'
import type { Token } from '../types/token.type'
import { getTokenContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'
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
 * Get a token by its contract address
 * @param contract - The contract address of the token
 * @returns A Token object
 */
export function getTokenByContract(contract: string): Token | undefined {
  return tokens[NETWORK_NAME].find((token) => token.contract === contract)
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
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })
    // Simulate and parse results
    const { result } = await tokenContractClient.balance(
      { id: address },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100,
      },
    )
    return result
  } catch (error) {
    if (!String(error).includes('Error(Storage, MissingValue)')) {
      console.error('Error fetching token balance:', String(error))
    }
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
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })
    const { result } = await tokenContractClient.allowance(
      {
        from: owner,
        spender: spender,
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100,
      },
    )
    return result
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
): Promise<AssembledTransaction<null>> {
  try {
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })
    const assembledTransaction = await tokenContractClient.approve(
      {
        from: spender,
        spender: spender,
        amount: amount,
        expiration_ledger: 535680, // ~30 days in ledgers
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100,
      },
    )

    // For write operations, we return the transaction to be submitted
    return assembledTransaction
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
): Promise<AssembledTransaction<null>> {
  try {
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })
    const assembledTransaction = await tokenContractClient.transfer(
      {
        from: to,
        to: to,
        amount: amount,
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100,
      },
    )

    // For write operations, we return the transaction to be submitted
    return assembledTransaction
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
): Promise<AssembledTransaction<null>> {
  try {
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })
    const assembledTransaction = await tokenContractClient.transfer_from(
      {
        from: from,
        spender: from, // This would need to be the actual spender address
        to: to,
        amount: amount,
      },
      {
        timeoutInSeconds: DEFAULT_TIMEOUT,
        fee: 100,
      },
    )

    // For write operations, we return the transaction to be submitted
    return assembledTransaction
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
    const tokenContractClient = getTokenContractClient({
      contractId: tokenAddress,
    })

    const [nameResult, symbolResult, decimalsResult] = await Promise.all([
      tokenContractClient
        .name({
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100,
        })
        .then(
          (assembledTransaction) => assembledTransaction.result,
          (e) => {
            console.error('Error fetching token name:', e)
            return ''
          },
        ),
      tokenContractClient
        .symbol({
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100,
        })
        .then(
          (assembledTransaction) => assembledTransaction.result,
          (e) => {
            console.error('Error fetching token symbol:', e)
            return ''
          },
        ),
      tokenContractClient
        .decimals({
          timeoutInSeconds: DEFAULT_TIMEOUT,
          fee: 100,
        })
        .then(
          (assembledTransaction) => assembledTransaction.result,
          (e) => {
            console.error('Error fetching token decimals:', e)
            return 0
          },
        ),
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
