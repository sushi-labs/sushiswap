import { TokenResponse } from '@defuse-protocol/one-click-sdk-typescript'
import * as StellarSdk from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from 'src/app/(networks)/(non-evm)/stellar/_common/lib/constants'
import { nativeFromChainId, newToken } from 'src/lib/currency-from-chain-id'
import {
  STELLAR_XLM_ADDRESS,
  type StellarAccountAddress,
  StellarChainId,
  type StellarContractAddress,
  StellarToken,
  isStellarAccountAddress,
  isStellarContractAddress,
} from 'sushi/stellar'
import { getAddress } from 'viem'
import {
  getNearIntentsChainId,
  isNearIntentsChainId,
  isNearIntentsEvmChainId,
} from './chains'
import type {
  NearIntentsCurrencyEntry,
  NearIntentsEvmToken,
  NearIntentsSdkToken,
  NearIntentsStellarToken,
  NearIntentsStellarTokenMetadata,
  NearIntentsSupportedChainId,
  NearIntentsSupportedEvmChainId,
  NearIntentsToken,
  NearIntentsTokenKind,
} from './types'

type NewTokenInput = Parameters<typeof newToken>[0]

const KNOWN_STELLAR_TOKEN_ICONS: Record<string, string> = {
  XLM: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
  'USDC:GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN':
    'https://stellar.myfilebase.com/ipfs/QmNcfZxs8e9uVyhEa3xoPWCsj3ZogGirtixMEC9Km4Fjm2',
}

function isStellarToken(token: NearIntentsSdkToken): boolean {
  return token.blockchain === 'stellar'
}

function getStellarTokenIcon(
  token: StellarToken | undefined,
): string | undefined {
  const icon = token?.metadata.icon

  return typeof icon === 'string' ? icon : undefined
}

function getKnownStellarTokenIcon({
  symbol,
  issuer,
}: {
  symbol: string
  issuer?: StellarAccountAddress
}): string | undefined {
  return issuer
    ? KNOWN_STELLAR_TOKEN_ICONS[`${symbol}:${issuer}`]
    : KNOWN_STELLAR_TOKEN_ICONS[symbol]
}

export function getTokenKind(token: NearIntentsSdkToken): NearIntentsTokenKind {
  if (isStellarToken(token)) {
    return token.contractAddress ? 'stellar-issued' : 'stellar-native'
  }

  return token.contractAddress ? 'erc20' : 'native'
}

export function getStellarTokenMetadata(token: {
  blockchain: NearIntentsSdkToken['blockchain']
  symbol: string
  name?: string
  decimals: number
  contractAddress?: string
  assetIssuer?: string
  logoURI?: string
}): NearIntentsStellarTokenMetadata | undefined {
  if (token.blockchain !== 'stellar') return undefined

  if (token.symbol === 'XLM' && !token.contractAddress && !token.assetIssuer) {
    const icon =
      token.logoURI ?? getKnownStellarTokenIcon({ symbol: token.symbol })
    const stellarToken = new StellarToken({
      chainId: StellarChainId.STELLAR,
      address: STELLAR_XLM_ADDRESS[StellarChainId.STELLAR],
      symbol: token.symbol,
      name: token.name ?? token.symbol,
      decimals: token.decimals,
      ...(icon ? { metadata: { icon } } : {}),
    })

    return {
      issuer: undefined,
      contract: stellarToken.address,
      token: stellarToken,
    }
  }

  const issuer = getStellarIssuer(token)
  const contract = getStellarContractAddress(token)

  if (!issuer || !contract) return undefined

  const icon =
    token.logoURI ?? getKnownStellarTokenIcon({ symbol: token.symbol, issuer })

  const stellarToken = new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: contract,
    symbol: token.symbol,
    name: token.name ?? token.symbol,
    decimals: token.decimals,
    issuer,
    ...(icon ? { metadata: { icon } } : {}),
  })

  return {
    issuer,
    contract,
    token: stellarToken,
  }
}

function getStellarIssuer(token: {
  contractAddress?: string
  assetIssuer?: string
}): StellarAccountAddress | undefined {
  if (token.assetIssuer && isStellarAccountAddress(token.assetIssuer)) {
    return token.assetIssuer
  }

  if (token.contractAddress && isStellarAccountAddress(token.contractAddress)) {
    return token.contractAddress
  }

  return undefined
}

function getStellarContractAddress(token: {
  symbol: string
  contractAddress?: string
  assetIssuer?: string
}): StellarContractAddress | undefined {
  if (
    token.contractAddress &&
    isStellarContractAddress(token.contractAddress)
  ) {
    return token.contractAddress
  }

  const issuer = getStellarIssuer(token)
  if (!issuer) return undefined

  return new StellarSdk.Asset(token.symbol, issuer).contractId(
    NETWORK_PASSPHRASE,
  ) as StellarContractAddress
}

export function normalizeSdkToken(
  token: NearIntentsSdkToken,
): NearIntentsToken | undefined {
  const chainId = getNearIntentsChainId(token.blockchain)
  if (!chainId) return undefined

  const kind = getTokenKind(token)

  if (isStellarToken(token)) {
    const metadata = getStellarTokenMetadata(token)
    if (!metadata) return undefined
    const logoURI = getStellarTokenIcon(metadata.token)

    return {
      assetId: token.assetId,
      chainId,
      blockchain: token.blockchain,
      symbol: metadata.token.symbol,
      name: metadata.token.name,
      decimals: token.decimals,
      priceUSD: String(token.price),
      priceUpdatedAt: token.priceUpdatedAt,
      ...(kind === 'stellar-issued'
        ? {
            contractAddress: metadata.contract,
            assetIssuer: metadata.issuer,
          }
        : {}),
      ...(logoURI ? { logoURI } : {}),
      kind,
    }
  }

  return {
    assetId: token.assetId,
    chainId,
    blockchain: token.blockchain,
    symbol: token.symbol,
    name: token.symbol,
    decimals: token.decimals,
    priceUSD: String(token.price),
    priceUpdatedAt: token.priceUpdatedAt,
    ...(token.contractAddress
      ? { contractAddress: getAddress(token.contractAddress) }
      : {}),
    kind,
  }
}

export function mapStellarTokenToNearIntents(
  stellarToken: StellarToken,
  sdkToken?: NearIntentsSdkToken,
): NearIntentsStellarToken {
  const kind: NearIntentsTokenKind =
    stellarToken.symbol === 'XLM' ? 'stellar-native' : 'stellar-issued'
  const logoURI = getStellarTokenIcon(stellarToken)

  return {
    assetId:
      sdkToken?.assetId ??
      `stellar:${stellarToken.symbol}:${stellarToken.issuer || stellarToken.address}`,
    chainId: StellarChainId.STELLAR,
    blockchain: 'stellar',
    symbol: stellarToken.symbol,
    name: stellarToken.name,
    decimals: sdkToken?.decimals ?? stellarToken.decimals,
    priceUSD: sdkToken ? String(sdkToken.price) : '0',
    priceUpdatedAt: sdkToken?.priceUpdatedAt ?? '',
    ...(kind === 'stellar-issued'
      ? {
          contractAddress: stellarToken.address,
          assetIssuer: stellarToken.issuer,
        }
      : {}),
    ...(logoURI ? { logoURI } : {}),
    kind,
  }
}

export function mapEvmNativeToken(
  chainId: NearIntentsSupportedEvmChainId,
  symbol: string,
  decimals: number,
  sdkToken?: NearIntentsSdkToken,
): NearIntentsEvmToken<typeof chainId> {
  if (!isNearIntentsEvmChainId(chainId)) {
    throw new Error(`Unsupported NEAR Intents chainId: ${chainId}`)
  }

  return {
    assetId: sdkToken?.assetId ?? `native:${chainId}`,
    chainId,
    blockchain: sdkToken?.blockchain ?? TokenResponse.blockchain.ETH,
    symbol,
    name: symbol,
    decimals,
    priceUSD: sdkToken ? String(sdkToken.price) : '0',
    priceUpdatedAt: sdkToken?.priceUpdatedAt ?? '',
    kind: 'native',
  }
}

export function mapEvmErc20Token(
  chainId: NearIntentsSupportedEvmChainId,
  symbol: string,
  decimals: number,
  contractAddress: AddressFor<typeof chainId>,
  sdkToken?: NearIntentsSdkToken,
): NearIntentsEvmToken<typeof chainId> {
  if (!isNearIntentsEvmChainId(chainId)) {
    throw new Error(`Unsupported NEAR Intents chainId: ${chainId}`)
  }

  return {
    assetId: sdkToken?.assetId ?? `${contractAddress}:${chainId}`,
    chainId,
    blockchain: sdkToken?.blockchain ?? TokenResponse.blockchain.ETH,
    symbol,
    name: symbol,
    decimals,
    priceUSD: sdkToken ? String(sdkToken.price) : '0',
    priceUpdatedAt: sdkToken?.priceUpdatedAt ?? '',
    contractAddress,
    kind: 'erc20',
  }
}

export function filterSupportedTokens(
  tokens: readonly NearIntentsSdkToken[],
): NearIntentsToken[] {
  return tokens
    .map((token) => normalizeSdkToken(token))
    .filter((token): token is NearIntentsToken => Boolean(token))
}

export function getCurrencyParam(
  currency: CurrencyFor<NearIntentsSupportedChainId>,
): string {
  if (currency.type === 'native') return 'NATIVE'

  return currency.address
}

export function getCurrencyEntryKey(
  chainId: NearIntentsSupportedChainId,
  tokenParam: string,
): string {
  return `${chainId}:${tokenParam}`
}

export function mapNearIntentsTokenToCurrencyEntry(
  token: NearIntentsToken,
): NearIntentsCurrencyEntry | undefined {
  if (isNearIntentsStellarToken(token)) {
    const metadata = getStellarTokenMetadata(token)
    if (!metadata) return undefined

    return {
      assetId: token.assetId,
      currency: metadata.token,
      priceUSD: token.priceUSD,
      priceUpdatedAt: token.priceUpdatedAt,
    }
  }

  if (!isNearIntentsEvmToken(token)) return undefined

  const currency = (
    token.kind === 'native'
      ? nativeFromChainId(token.chainId)
      : token.contractAddress
        ? newToken({
            address: getAddress(token.contractAddress),
            chainId: token.chainId,
            decimals: token.decimals,
            name: token.name ?? token.symbol,
            symbol: token.symbol,
          } as NewTokenInput)
        : undefined
  ) as CurrencyFor<NearIntentsSupportedChainId> | undefined

  if (!currency) return undefined

  return {
    assetId: token.assetId,
    currency,
    priceUSD: token.priceUSD,
    priceUpdatedAt: token.priceUpdatedAt,
  }
}

export function mapNearIntentsTokensToCurrencyEntries(
  tokens: readonly NearIntentsToken[],
): NearIntentsCurrencyEntry[] {
  return tokens
    .map((token) => mapNearIntentsTokenToCurrencyEntry(token))
    .filter((entry): entry is NearIntentsCurrencyEntry => Boolean(entry))
}

export function getNearIntentsAssetId(
  entries: readonly NearIntentsCurrencyEntry[],
  currency: CurrencyFor<NearIntentsSupportedChainId> | undefined,
): string | undefined {
  if (!currency) return undefined

  const tokenParam = getCurrencyParam(currency)
  return entries.find(
    (entry) =>
      entry.currency.chainId === currency.chainId &&
      getCurrencyParam(entry.currency) === tokenParam,
  )?.assetId
}

export function isNearIntentsTokenForChain<
  TChainId extends NearIntentsSupportedChainId,
>(
  token: NearIntentsToken | undefined,
  chainId: TChainId,
): token is NearIntentsToken<TChainId> {
  return Boolean(token && token.chainId === chainId)
}

export function isNearIntentsEvmToken(
  token: NearIntentsToken | undefined,
): token is NearIntentsEvmToken {
  return Boolean(token && isNearIntentsEvmChainId(token.chainId))
}

export function isNearIntentsStellarToken(
  token: NearIntentsToken | undefined,
): token is NearIntentsStellarToken {
  return Boolean(token && token.chainId === StellarChainId.STELLAR)
}

export function getDefaultTokenForChain(
  tokens: readonly NearIntentsToken[],
  chainId: number,
): NearIntentsToken | undefined {
  if (!isNearIntentsChainId(chainId)) return undefined

  if (chainId === StellarChainId.STELLAR) {
    return (
      tokens.find(
        (token) => token.chainId === chainId && token.kind === 'stellar-native',
      ) ?? tokens.find((token) => token.chainId === chainId)
    )
  }

  return (
    tokens.find(
      (token) => token.chainId === chainId && token.kind === 'native',
    ) ?? tokens.find((token) => token.chainId === chainId)
  )
}
