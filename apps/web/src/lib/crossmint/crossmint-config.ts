import { getChainById } from 'sushi'
import { EvmChainId, STABLES } from 'sushi/evm'
import { SVM_STABLES, SvmChainId } from 'sushi/svm'

export const CROSSMINT_CLIENT_SIDE_API_KEY =
  process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY?.trim()

export const CROSSMINT_CONFIGURED_TOKEN_CHAIN_IDS = [
  EvmChainId.BASE,
  SvmChainId.SOLANA,
] as const

export type CrossmintConfiguredTokenChainId =
  (typeof CROSSMINT_CONFIGURED_TOKEN_CHAIN_IDS)[number]
export type CrossmintCheckoutToken = TokenFor<EvmChainId | SvmChainId>
export type CrossmintEnvironment = 'production' | 'staging'
export type CrossmintWalletNamespace = 'evm' | 'svm'

const CROSSMINT_API_URLS = {
  production: 'https://www.crossmint.com/api',
  staging: 'https://staging.crossmint.com/api',
} as const satisfies Record<CrossmintEnvironment, string>

export interface SerializedCrossmintToken {
  address: string
  chainId: CrossmintConfiguredTokenChainId
  symbol: string
}

export interface CrossmintTarget {
  asset: string
  environment: CrossmintEnvironment
  kind: 'memecoin' | 'stablecoin'
  linkChain: 'base' | 'base-sepolia' | 'solana'
  network: string
  requestedAsset: string
  requiresWalletLink: boolean
  stagingNotice?: string
  tokenLocator: string
  walletNamespace: CrossmintWalletNamespace
}

const STAGING_TARGETS = {
  baseUsdc: {
    asset: 'USDC',
    linkChain: 'base-sepolia',
    network: 'Base Sepolia',
    tokenLocator: 'base-sepolia:0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
  solanaUsdc: {
    asset: 'USDC',
    linkChain: 'solana',
    network: 'Solana Devnet',
    tokenLocator: 'solana:4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  },
  solanaXmeme: {
    asset: 'XMEME',
    linkChain: 'solana',
    network: 'Solana Devnet',
    tokenLocator: 'solana:7EivYFyNfgGj8xbUymR7J4LuxUHLKRzpLaERHLvi7Dgu',
  },
} as const

function isSameAddress(first: string, second: string): boolean {
  return first.toLowerCase() === second.toLowerCase()
}

function isStablecoin(token: SerializedCrossmintToken): boolean {
  if (token.chainId === EvmChainId.BASE) {
    return STABLES[EvmChainId.BASE].some((stablecoin) =>
      isSameAddress(stablecoin.address, token.address),
    )
  }

  return SVM_STABLES[SvmChainId.SOLANA].some((stablecoin) =>
    isSameAddress(stablecoin.address, token.address),
  )
}

function assertSupportedOnrampToken(token: SerializedCrossmintToken): void {
  const symbol = token.symbol.toUpperCase()

  if (symbol !== 'USDC' && symbol !== 'USDT') {
    throw new Error(
      `${token.symbol} is a stablecoin, but Crossmint Onramp currently supports USDC and USDT`,
    )
  }
}

function getStagingTarget(
  token: SerializedCrossmintToken,
  stablecoin: boolean,
): CrossmintTarget {
  if (stablecoin) {
    assertSupportedOnrampToken(token)
    const stagingTarget =
      token.chainId === EvmChainId.BASE
        ? STAGING_TARGETS.baseUsdc
        : STAGING_TARGETS.solanaUsdc

    return {
      ...stagingTarget,
      environment: 'staging',
      kind: 'stablecoin',
      requestedAsset: token.symbol,
      requiresWalletLink: true,
      stagingNotice: `Staging uses Crossmint's ${stagingTarget.asset} test token on ${stagingTarget.network} in place of ${token.symbol} on mainnet.`,
      walletNamespace: token.chainId === EvmChainId.BASE ? 'evm' : 'svm',
    }
  }

  if (token.chainId === EvmChainId.BASE) {
    throw new Error(
      'Crossmint staging memecoin checkout is currently available only on Solana Devnet',
    )
  }

  return {
    ...STAGING_TARGETS.solanaXmeme,
    environment: 'staging',
    kind: 'memecoin',
    requestedAsset: token.symbol,
    requiresWalletLink: false,
    stagingNotice: `Staging delivers Crossmint's XMEME test token in place of ${token.symbol}. Production uses the selected token's Solana address.`,
    walletNamespace: 'svm',
  }
}

function getProductionTarget(
  token: SerializedCrossmintToken,
  stablecoin: boolean,
): CrossmintTarget {
  const walletNamespace = token.chainId === EvmChainId.BASE ? 'evm' : 'svm'
  const locatorPrefix = token.chainId === EvmChainId.BASE ? 'base' : 'solana'

  if (stablecoin) {
    assertSupportedOnrampToken(token)
  }

  return {
    asset: token.symbol,
    environment: 'production',
    kind: stablecoin ? 'stablecoin' : 'memecoin',
    linkChain: locatorPrefix,
    network: getChainById(token.chainId).name,
    requestedAsset: token.symbol,
    requiresWalletLink: stablecoin,
    tokenLocator: `${locatorPrefix}:${token.address}`,
    walletNamespace,
  }
}

export function getCrossmintEnvironment(apiKey: string): CrossmintEnvironment {
  if (apiKey.startsWith('ck_staging_') || apiKey.startsWith('sk_staging_')) {
    return 'staging'
  }

  if (
    apiKey.startsWith('ck_production_') ||
    apiKey.startsWith('sk_production_')
  ) {
    return 'production'
  }

  throw new Error('Crossmint API key has an unsupported format')
}

export function getCrossmintApiUrl(environment: CrossmintEnvironment): string {
  return CROSSMINT_API_URLS[environment]
}

export function isCrossmintConfiguredTokenChainId(
  chainId: number,
): chainId is CrossmintConfiguredTokenChainId {
  return CROSSMINT_CONFIGURED_TOKEN_CHAIN_IDS.some(
    (supportedChainId) => supportedChainId === chainId,
  )
}

export function serializeCrossmintToken(
  token: CrossmintCheckoutToken,
): SerializedCrossmintToken {
  if (!isCrossmintConfiguredTokenChainId(token.chainId)) {
    throw new Error(
      `Crossmint checkout is not configured for chain ${token.chainId}`,
    )
  }

  return {
    address: token.address,
    chainId: token.chainId,
    symbol: token.symbol,
  }
}

export function getCrossmintTarget(
  token: SerializedCrossmintToken,
  environment: CrossmintEnvironment,
): CrossmintTarget {
  const stablecoin = isStablecoin(token)

  return environment === 'staging'
    ? getStagingTarget(token, stablecoin)
    : getProductionTarget(token, stablecoin)
}
