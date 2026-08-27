import {
  type TokenListChainId,
  getTokenList,
  isTokenListChainId,
} from '@sushiswap/graph-client/data-api'
import type { CrossmintCheckoutSupportedChainId } from 'src/config'
import {
  ChainId,
  getChainById,
  getIdFromChainIdAddress,
  getTokenFor,
} from 'sushi'
import {
  type EvmAddress,
  type EvmChainId,
  isEvmAddress,
  isEvmChainId,
} from 'sushi/evm'
import {
  type StellarChainId,
  type StellarContractAddress,
  StellarToken,
  isStellarChainId,
  isStellarContractAddress,
} from 'sushi/stellar'
import {
  type SvmAddress,
  type SvmChainId,
  isSvmAddress,
  isSvmChainId,
} from 'sushi/svm'
import {
  type CrossmintCheckoutCatalogToken,
  type CrossmintEnvironment,
  getCrossmintStagingCheckoutToken,
} from './crossmint-config'
import type {
  CrossmintCheckoutTokenAvailability,
  CrossmintCheckoutTokenEntry,
} from './types'

const CROSSMINT_TOKEN_LIST_PAGE_SIZE = 100
const CROSSMINT_CUSTOM_TOKEN_APPROVAL_STATUSES = ['PERMISSIONLESS'] as const

const CROSSMINT_CHAIN_NAMES: Partial<Record<ChainId, string>> = {
  [ChainId.ARBITRUM]: 'arbitrum',
  [ChainId.BSC]: 'bsc',
  [ChainId.MODE]: 'mode',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.ROBINHOOD]: 'robinhood-chain',
}

type CrossmintTokenListChainId = CrossmintCheckoutSupportedChainId &
  TokenListChainId &
  (EvmChainId | SvmChainId | StellarChainId)

interface ParsedCrossmintTokenLocator {
  address: EvmAddress | SvmAddress | StellarContractAddress
  availability: CrossmintCheckoutTokenAvailability
  chainId: CrossmintTokenListChainId
  locator: string
}

export function chainIdsToCrossmintName(
  chainIds: readonly CrossmintCheckoutSupportedChainId[],
): string[] {
  return chainIds.map(
    (chainId) =>
      CROSSMINT_CHAIN_NAMES[chainId] ??
      getChainById(chainId).name.toLowerCase(),
  )
}

function getCrossmintChainIdsByName(
  chainIds: readonly CrossmintCheckoutSupportedChainId[],
): ReadonlyMap<string, CrossmintCheckoutSupportedChainId> {
  return new Map(
    chainIds.map((chainId) => [chainIdsToCrossmintName([chainId])[0], chainId]),
  )
}

function isCrossmintTokenListChainId(
  chainId: CrossmintCheckoutSupportedChainId,
): chainId is CrossmintTokenListChainId {
  return (
    isTokenListChainId(chainId) &&
    (isEvmChainId(chainId) ||
      isSvmChainId(chainId) ||
      isStellarChainId(chainId))
  )
}

function parseCrossmintTokenLocator(
  availability: CrossmintCheckoutTokenAvailability,
  chainIdsByName: ReadonlyMap<string, CrossmintCheckoutSupportedChainId>,
): ParsedCrossmintTokenLocator | undefined {
  const separatorIndex = availability.token.indexOf(':')

  if (separatorIndex <= 0 || separatorIndex === availability.token.length - 1) {
    return undefined
  }

  const crossmintChain = availability.token.slice(0, separatorIndex)
  const address = availability.token.slice(separatorIndex + 1)
  const chainId = chainIdsByName.get(crossmintChain)

  if (!chainId || !isCrossmintTokenListChainId(chainId)) {
    return undefined
  }

  if (isEvmChainId(chainId)) {
    if (!isEvmAddress(address)) return undefined

    return {
      address,
      availability,
      chainId,
      locator: availability.token,
    }
  }

  if (isSvmChainId(chainId)) {
    if (!isSvmAddress(address)) return undefined

    return {
      address,
      availability,
      chainId,
      locator: availability.token,
    }
  }

  if (!isStellarContractAddress(address)) return undefined

  return {
    address,
    availability,
    chainId,
    locator: availability.token,
  }
}

function createCheckoutTokenEntry(
  availability: CrossmintCheckoutTokenAvailability,
  token: CrossmintCheckoutCatalogToken,
): CrossmintCheckoutTokenEntry {
  return {
    available: true,
    features: availability.features,
    locator: availability.token,
    token,
  }
}

async function getTokenEntriesForChain(
  chainId: CrossmintTokenListChainId,
  locators: readonly ParsedCrossmintTokenLocator[],
): Promise<CrossmintCheckoutTokenEntry[]> {
  const tokens = await getTokenList({
    approvalStatuses: [...CROSSMINT_CUSTOM_TOKEN_APPROVAL_STATUSES],
    chainId,
    customTokens: locators.map(({ address }) => address),
    first: CROSSMINT_TOKEN_LIST_PAGE_SIZE,
  })
  const tokensById = new Map(tokens.map((token) => [token.id, token]))

  return locators.flatMap((locator) => {
    const id = getIdFromChainIdAddress(locator.chainId, locator.address)
    const token = tokensById.get(id)

    if (!token || token.approvalStatus === 'DISAPPROVED') return []

    let checkoutToken: CrossmintCheckoutCatalogToken

    if (isStellarChainId(chainId)) {
      if (!isStellarContractAddress(locator.address)) return []

      checkoutToken = new StellarToken({
        ...token,
        address: locator.address,
        chainId,
        issuer: token.stellarMetadata?.issuer ?? undefined,
        metadata: {
          approved: token.approved,
          approvalStatus: token.approvalStatus,
          domain: token.stellarMetadata?.domain ?? undefined,
        },
      })
    } else {
      checkoutToken = getTokenFor(chainId, {
        ...token,
        metadata: {
          approved: token.approved,
          approvalStatus: token.approvalStatus,
        },
      })
    }

    return [createCheckoutTokenEntry(locator.availability, checkoutToken)]
  })
}

export async function getCrossmintCheckoutTokenEntries({
  availabilities,
  chainIds,
  environment,
}: {
  availabilities: readonly CrossmintCheckoutTokenAvailability[]
  chainIds: readonly CrossmintCheckoutSupportedChainId[]
  environment: CrossmintEnvironment
}): Promise<CrossmintCheckoutTokenEntry[]> {
  const availableTokens = availabilities.filter(({ available }) => available)
  const entriesByLocator = new Map<string, CrossmintCheckoutTokenEntry>()
  const chainIdsByName = getCrossmintChainIdsByName(chainIds)
  const locatorsByChainId = new Map<
    CrossmintTokenListChainId,
    ParsedCrossmintTokenLocator[]
  >()

  for (const availability of availableTokens) {
    if (environment === 'staging') {
      const stagingToken = getCrossmintStagingCheckoutToken(availability.token)

      if (
        stagingToken &&
        chainIds.some((chainId) => chainId === stagingToken.chainId)
      ) {
        entriesByLocator.set(
          availability.token,
          createCheckoutTokenEntry(availability, stagingToken),
        )
      }

      continue
    }

    const locator = parseCrossmintTokenLocator(availability, chainIdsByName)

    if (!locator) continue

    const chainLocators = locatorsByChainId.get(locator.chainId) ?? []
    chainLocators.push(locator)
    locatorsByChainId.set(locator.chainId, chainLocators)
  }

  const entries = await Promise.all(
    Array.from(locatorsByChainId, ([chainId, locators]) =>
      getTokenEntriesForChain(chainId, locators),
    ),
  )

  for (const entry of entries.flat()) {
    entriesByLocator.set(entry.locator, entry)
  }

  return availableTokens.flatMap(({ token: locator }) => {
    const entry = entriesByLocator.get(locator)
    return entry ? [entry] : []
  })
}
