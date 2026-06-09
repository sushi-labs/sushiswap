import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import {
  type StellarAccountAddress,
  StellarChainId,
  type StellarContractAddress,
  StellarToken,
  isStellarAccountAddress,
  isStellarContractAddress,
  normalizeStellarAddress,
} from 'sushi/stellar'
import { z } from 'zod'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'

const stellarExpertAssetSchema = z.object({
  code: z.string(),
  issuer: z
    .custom<StellarAccountAddress>((val) =>
      isStellarAccountAddress(val as string),
    )
    .transform(normalizeStellarAddress),
  contract: z
    .custom<StellarContractAddress>((val) =>
      isStellarContractAddress(val as string),
    )
    .transform(normalizeStellarAddress),
  name: z.string(),
  org: z.string(),
  decimals: z.number(),
  icon: z.string().optional(),
  domain: z.string().optional(),
})

const stellarExpertAPIResponseSchema = z.object({
  name: z.string(),
  provider: z.string(),
  description: z.string(),
  version: z.string(),
  network: z.string(),
  feedback: z.string(),
  assets: z.array(stellarExpertAssetSchema),
})

const stellarExpertTopTokensApiUrl =
  'https://api.stellar.expert/explorer/public/asset-list/top50'

const OUTDATED_TOKENS = new Set([
  'AFR|afreum.com', //code|domain
  'FIDR|fixedidr.com',
  'FRED|fredenergy.org',
  'iFIDR|fixedidr.com',
  'MOBI|mobius.network',
  'XXA|ixinium.io',
  'USD|stablecoin.anchorusd.com',
])

const whitelistedTokens = [
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: 'CC64WBDGS6QQP22QTTIACYIXT3WF7BBQEYOQPLTP7GTKYY7PZ74QYGSL',
    symbol: 'deJAAA',
    name: 'deJAAA',
    origin: 'centrifuge',
    decimals: 18,
    metadata: {
      domain: 'centrifuge.io',
      icon: 'https://cdn.sushi.com/image/upload/v1780067232/tokens/-4/CC64WBDGS6QQP22QTTIACYIXT3WF7BBQEYOQPLTP7GTKYY7PZ74QYGSL.png',
    },
  }),
  new StellarToken({
    chainId: StellarChainId.STELLAR,
    address: 'CBI7UCH5KGSVQRO5H4SUCZUTZABCITZLRHQQZTWL2TK4RZ72TAR6IHRV',
    symbol: 'deJTRSY',
    name: 'deJTRSY',
    origin: 'centrifuge',
    decimals: 18,
    metadata: {
      domain: 'centrifuge.io',
      icon: 'https://cdn.sushi.com/image/upload/v1780067208/tokens/-4/CBI7UCH5KGSVQRO5H4SUCZUTZABCITZLRHQQZTWL2TK4RZ72TAR6IHRV.png',
    },
  }),
]

const getStellarExpertAssets = async () => {
  if (!stellarExpertTopTokensApiUrl) {
    return []
  }
  const response = await fetch(stellarExpertTopTokensApiUrl, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`StellarExpert API error: ${response.status}`)
  }

  const data = await response.json()
  const parsed = stellarExpertAPIResponseSchema.safeParse(data)
  if (!parsed.success) {
    console.warn(
      '[getStellarExpertAssets] Response validation failed, using empty list:',
      parsed.error,
    )
    return []
  }

  const assets = parsed.data.assets
  return assets
    .filter((i) => i.domain && !OUTDATED_TOKENS.has(`${i.code}|${i.domain}`))
    .map(
      (asset) =>
        new StellarToken({
          chainId: StellarChainId.STELLAR,
          address: asset.contract,
          symbol: asset.code,
          name: asset.name,
          decimals: asset.decimals,
          issuer: asset.issuer,
          origin: asset.org,
          metadata: { icon: asset.icon, domain: asset.domain },
        }),
    )
}

export const fetchCommonTokensQueryFn = async (): Promise<
  Record<string, StellarToken>
> => {
  const result: Record<string, StellarToken> = {}

  // Always include hardcoded tokens. Use the StellarToken's normalized
  // (uppercase) address as the key for case-insensitive lookups.
  for (const token of [...staticTokens, ...whitelistedTokens]) {
    result[token.address] = token
  }

  // Try to add StellarExpert tokens
  try {
    const assets = await getStellarExpertAssets()
    assets.forEach((token) => {
      result[token.address] = token
    })
  } catch (error) {
    console.warn(
      `[useCommonTokens] StellarExpert failed, using ${staticTokens.length + whitelistedTokens.length} hardcoded tokens only:`,
      error,
    )
  }

  return result
}

export function useCommonTokens() {
  return useQuery({
    queryKey: ['stellar', 'common-tokens'],
    queryFn: () => fetchCommonTokensQueryFn(),
    placeholderData: keepPreviousData,
    staleTime: ms('1h'),
    gcTime: ms('1d'),
    retry: 1,
  })
}
