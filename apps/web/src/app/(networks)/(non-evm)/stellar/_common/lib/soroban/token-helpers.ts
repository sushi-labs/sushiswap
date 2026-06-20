import type { AssembledTransaction } from '@stellar/stellar-sdk/contract'
import { getTokenList } from '@sushiswap/graph-client/data-api'
import { createTokenListToken } from 'src/lib/wagmi/components/token-selector/hooks/token-list-token'
import {
  type StellarAddress,
  StellarChainId,
  type StellarContractAddress,
  StellarToken,
  normalizeStellarAddress,
} from 'sushi/stellar'
import { formatAddress } from '../utils/format'
import { getTokenContractClient } from './client'
import { DEFAULT_TIMEOUT } from './constants'

const tokenListLookupCache = new Map<
  StellarContractAddress,
  Promise<StellarToken | undefined>
>()

async function getTokenFromTokenList(
  contract: StellarContractAddress,
): Promise<StellarToken | undefined> {
  const canonicalContract = normalizeStellarAddress(contract)
  const cached = tokenListLookupCache.get(canonicalContract)
  if (cached) {
    return cached
  }

  const lookup = getTokenList({
    chainId: StellarChainId.STELLAR,
    customTokens: [canonicalContract],
    first: 1,
  })
    .then((tokens) => {
      const [token] = tokens
      return token
        ? createTokenListToken(StellarChainId.STELLAR, token)
        : undefined
    })
    .catch(() => {
      tokenListLookupCache.delete(canonicalContract)
      return undefined
    })

  tokenListLookupCache.set(canonicalContract, lookup)
  return lookup
}

/**
 * Get a token by its contract address (case-insensitive).
 * Stellar contract addresses are case-insensitive, but may be stored
 * or returned in different cases by different systems.
 *
 * @param contract - The contract address of the token
 */
export async function getTokenByContract(
  contract: StellarContractAddress,
): Promise<StellarToken> {
  const tokenFromList = await getTokenFromTokenList(contract)
  if (tokenFromList) {
    return tokenFromList
  }

  // Fallback: fetch from chain
  const canonicalContract = normalizeStellarAddress(contract)
  try {
    const onChainMetadata = await getTokenMetadata(canonicalContract)
    return new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: canonicalContract,
      symbol: onChainMetadata.symbol || formatAddress(canonicalContract),
      name:
        onChainMetadata.name ||
        onChainMetadata.symbol ||
        formatAddress(canonicalContract),
      decimals: onChainMetadata.decimals,
      origin: 'unknown',
    })
  } catch (error) {
    console.warn(`Failed to fetch metadata for token ${contract}:`, error)
    return new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: canonicalContract,
      symbol: formatAddress(canonicalContract),
      name: formatAddress(canonicalContract),
      decimals: 7,
      origin: 'unknown',
    })
  }
}

/**
 * Get the balance of a token for an address
 * @param address - The address to get the balance of
 * @param tokenAddress - The token contract address
 * @returns The balance of the address
 */
export async function getTokenBalance(
  address: StellarAddress,
  tokenAddress: StellarContractAddress,
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
 * Get token metadata
 * @param tokenAddress - The token contract address
 * @returns Token metadata
 */
async function getTokenMetadata(tokenAddress: StellarContractAddress): Promise<{
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
