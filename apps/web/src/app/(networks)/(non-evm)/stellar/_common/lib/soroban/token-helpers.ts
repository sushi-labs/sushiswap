import type { AssembledTransaction } from '@stellar/stellar-sdk/contract'
import { staticTokens } from '../assets/token-assets'
import type { Token } from '../types/token.type'
import { getTokenContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'

/**
 * Gets the tokens without any alteration
 * @returns An array of Tokens
 */
export function getBaseTokens(): Token[] {
  const baseTokens: Token[] = staticTokens
  return baseTokens
}

/**
 * Gets the stable tokens without any alteration
 * @returns An array of Tokens
 */
export function getStableTokens(): Token[] {
  const stableTokens: Token[] = staticTokens.filter((token) => token.isStable)
  return stableTokens
}

/**
 * Helper to find a token by contract address (case-insensitive) in a token map.
 */
function findTokenInMap(
  tokenMap: Record<string, Token>,
  contract: string,
): Token | undefined {
  // Direct lookup first (most common case)
  if (tokenMap[contract]) {
    return tokenMap[contract]
  }
  // Try uppercase (Stellar convention)
  const upperAddress = contract.toUpperCase()
  if (tokenMap[upperAddress]) {
    return tokenMap[upperAddress]
  }
  // Fallback: case-insensitive search
  const lowerAddress = contract.toLowerCase()
  for (const [key, token] of Object.entries(tokenMap)) {
    if (key.toLowerCase() === lowerAddress) {
      return token
    }
  }
  return undefined
}

/**
 * Get a token by its contract address (case-insensitive).
 * Stellar contract addresses are case-insensitive, but may be stored
 * or returned in different cases by different systems.
 *
 * @param contract - The contract address of the token
 * @param dynamicTokens - Optional dynamic token map to check first (e.g., from useCommonTokens)
 * @returns A Token object
 */
export async function getTokenByContract(
  contract: string,
  dynamicTokens?: Record<string, Token>,
): Promise<Token> {
  // Check dynamic tokens first (includes StellarExpert tokens)
  if (dynamicTokens) {
    const dynamicToken = findTokenInMap(dynamicTokens, contract)
    if (dynamicToken) {
      return dynamicToken
    }
  }

  // Check static tokens (case-insensitive)
  const contractLower = contract.toLowerCase()
  const tokenFromList = staticTokens.find(
    (token) => token.contract.toLowerCase() === contractLower,
  )
  if (tokenFromList) {
    return tokenFromList
  }

  // Fallback: fetch from chain
  try {
    const metadata = await getTokenMetadata(contract)
    return {
      contract,
      code: metadata.symbol || contract.slice(0, 8),
      name: metadata.name || metadata.symbol || contract.slice(0, 8),
      decimals: metadata.decimals,
      issuer: '',
      org: 'unknown',
      isStable: false,
    }
  } catch (error) {
    console.warn(`Failed to fetch metadata for token ${contract}:`, error)
    return {
      contract,
      code: contract.slice(0, 8),
      name: contract.slice(0, 8),
      decimals: 7,
      issuer: '',
      org: 'unknown',
      isStable: false,
    }
  }
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
    const errorStr = String(error)
    if (
      !errorStr.includes('Error(Storage, MissingValue)') &&
      !errorStr.includes('trustline entry is missing')
    ) {
      console.error('Error fetching token balance:', errorStr)
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
      // No publicKey needed for read-only allowance queries
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
async function getTokenMetadata(tokenAddress: string): Promise<{
  name: string
  symbol: string
  decimals: number
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
          (assembledTransaction: AssembledTransaction<string>) =>
            assembledTransaction.result,
          (e: any) => {
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
          (assembledTransaction: AssembledTransaction<string>) =>
            assembledTransaction.result,
          (e: any) => {
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
          (assembledTransaction: AssembledTransaction<number>) =>
            assembledTransaction.result,
          (e: any) => {
            console.error('Error fetching token decimals:', e)
            return 0
          },
        ),
    ])

    return {
      name: nameResult || '',
      symbol: symbolResult || '',
      decimals: decimalsResult || 0,
    }
  } catch (error) {
    console.error('Error fetching token metadata:', error)
    return {
      name: '',
      symbol: '',
      decimals: 0,
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
