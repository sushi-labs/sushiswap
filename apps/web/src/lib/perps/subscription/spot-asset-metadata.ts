import type { SpotMetaResponse } from '@nktkas/hyperliquid'
import { IS_PERPS_TESTNET } from '../config'

type SpotUniverseEntry = SpotMetaResponse['universe'][number]
type StrictSpotAsset = {
  marketType: 'perp' | 'spot'
  spotId?: string
  baseTokenId?: string
}

const STRICT_MAINNET_SPOT_TOKEN_IDS = new Set([
  '0xc1fb593aeffbeb02f85e0308e9956a90',
  '0xbaf265ef389da684513d98d68edf4eae',
  '0xbb03842e1f71ed27ed8fa012b29affd4',
  '0xfcf28885456bf7e7cbe5b7a25407c5bc',
  '0x38348c17e1a18559bbda232d22007695',
  '0x0d01dc56dcaaca66ad901c959b4011ec',
  '0xe85f43e1f91e3c8cdf3acbd7e0855b8e',
  '0xbebb35d03b83a302a2aa06dbaa67dd9f',
  '0xcf548188e24a0ce3dc3b281242baafd9',
  '0x8f254b963e8468305d409b33aa137c67',
  '0xe1edd30daaf5caac3fe63569e24748da',
  '0x88102bea0bbad5f301f6e9e4dacdf979',
  '0x2e6d84f2d7ca82e6581e03523e4389f7',
  '0x84ecb2340931f6b153ff10bcfafb6726',
  '0x25faedc3f054130dbb4e4203aca63567',
  '0x49b67c39f5566535de22b29b0e51e685',
  '0x7650808198966e4285687d3deb556ccc',
  '0x1765b5a9ec8fc3cdbc209c63cac68e86',
  '0xfd61ec89811ba3cf2ae12d0ed8ef1afd',
  '0xd289c79872a9eace15cc4cadb030661f',
  '0xa043053570d42d6f553896820dfd42b6',
  '0x544e60f98a36d7b22c0fb5824b84f795',
  '0x2ff71b802a6788a052c7f1a58ec863af',
  '0xb113d34e351cf195733c98442530c099',
  '0x54e00a5988577cb0b0c9ab0cb6ef7f4b',
  '0x2c54c60600e1d786b2dfc139a38a5a99',
  '0x9cd8fd4cae61e63a10ba7615780ee520',
  '0x593494b6af79172fa983a0cf1c88e0e0',
  '0xbc8a22f25703a03101630ce6b09f4baa',
  '0x58dae745c8c5fed4012f35ef39829c2d',
  '0xbd31bd605c0a1b82c72aae3587f9061f',
  '0x9fb16485b70ac89fd8c45b1a130e1601',
  '0x83a0bf54708a0236a49f7301677ffdc2',
  '0xec43194f64d555bdaef5afb5b6c6c686',
  '0x9325025f805731935c1df7f97e654cda',
  '0xedfb8d993ee8cb935338601d8673dfcf',
  '0x1684cb225aa305ea5be44f2a79214e7e',
  '0xbf086597fdd837bfb58cf968533edaf3',
  '0x5e887f0c6c3deec190c36186bf23369f',
  '0x1c994ad3381d31c86c8c2d74ed89a365',
  '0xbe946bd7862245615d6729ec5b67cc7e',
  '0x85b8124314ae77b78b4b6f20ecd93149',
  '0x730fc3855fb77d2aa5a19dd7891dbe80',
  '0x4519b5c4a2fd0beb66306336f63c7b99',
  '0xa7e941cbc468d48b99dc6002f8f5042b',
  '0x4f49b5f025c969501c6a350f984e1725',
  '0x0896dbb30344c65b8727f41c3fe9ef62',
])

const STRICT_TESTNET_SPOT_TOKEN_IDS = new Set([
  '0xc4bf3f870c0e9465323c0b6ed28096c2',
  '0xd986b6fd648918a55dafc525b79f9095',
  '0x3a66f36f388dd3b7f04bcf55855482a2',
  '0x7317beb7cceed72ef0b346074cc8e7ab',
  '0xe4371d8166f362d6578725f11e0a14f3',
  '0x0740d272a61e2ee49107c96562b23934',
  '0xcc5da3a373f1e28955ab309b99293e58',
])

const STRICT_SPOT_TOKEN_IDS = IS_PERPS_TESTNET
  ? STRICT_TESTNET_SPOT_TOKEN_IDS
  : STRICT_MAINNET_SPOT_TOKEN_IDS

export type SpotAssetMetadata = {
  isCanonical: boolean
  spotId?: string
  baseTokenId?: string
  quoteTokenId?: string
}

export function getSpotAssetMetadata(
  meta: SpotMetaResponse,
  universeEntry: SpotUniverseEntry,
): SpotAssetMetadata {
  const [baseTokenIndex, quoteTokenIndex] = universeEntry.tokens
  const baseToken = meta.tokens[baseTokenIndex]
  const quoteToken = meta.tokens[quoteTokenIndex]

  return {
    isCanonical: universeEntry.isCanonical,
    // Hyperliquid uses the base token id for its strict spot allowlist.
    spotId: baseToken?.tokenId,
    baseTokenId: baseToken?.tokenId,
    quoteTokenId: quoteToken?.tokenId,
  }
}

export function findSpotAssetMetadata(
  meta: SpotMetaResponse | undefined,
  coin: string,
): SpotAssetMetadata | undefined {
  if (!meta) return undefined

  const universeEntry = meta.universe.find(
    (entry) => entry.name === coin || `@${entry.index}` === coin,
  )

  if (!universeEntry) return undefined

  return getSpotAssetMetadata(meta, universeEntry)
}

export function isStrictSpotTokenId(tokenId: string | undefined): boolean {
  if (!tokenId) return false

  return STRICT_SPOT_TOKEN_IDS.has(tokenId.toLowerCase())
}

export function isStrictSpotAsset(asset: StrictSpotAsset): boolean {
  if (asset.marketType !== 'spot') return true

  return isStrictSpotTokenId(asset.spotId ?? asset.baseTokenId)
}
