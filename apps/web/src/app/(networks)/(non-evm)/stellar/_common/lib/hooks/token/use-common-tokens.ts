import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'
import { IS_FUTURENET } from '~stellar/_common/lib/constants'
import type { Token } from '~stellar/_common/lib/types/token.type'

const stellarExpertAssetSchema = z.object({
  code: z.string(),
  issuer: z.string().optional(),
  contract: z.string().optional(),
  name: z.string().optional(),
  org: z.string().optional(),
  decimals: z.number().optional(),
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

const stellarExpertTopTokensApiUrl = IS_FUTURENET
  ? undefined
  : 'https://api.stellar.expert/explorer/public/asset-list/top50'

const getStellarExpertAssets = async (): Promise<
  z.infer<typeof stellarExpertAssetSchema>[]
> => {
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

  return parsed.data.assets
}

const convertToToken = (
  asset: z.infer<typeof stellarExpertAssetSchema>,
): Token | null => {
  if (
    !asset.contract ||
    asset.contract.length === 0 ||
    asset.decimals === undefined
  ) {
    return null
  }

  return {
    code: asset.code,
    issuer: asset.issuer ?? '',
    contract: asset.contract,
    name: asset.name ?? '',
    org: asset.org ?? 'unknown',
    decimals: asset.decimals,
    icon: asset.icon,
    domain: asset.domain,
  }
}

const hardcodedTokens: Token[] = staticTokens
  .filter((token) => token.contract && token.contract.length > 0)
  .slice(0, 50)

const fetchCommonTokensQueryFn = async (): Promise<Record<string, Token>> => {
  const result: Record<string, Token> = {}

  // Always include hardcoded tokens
  // Use uppercase keys for consistency (Stellar addresses are case-insensitive)
  hardcodedTokens.forEach((token) => {
    result[token.contract.toUpperCase()] = token
  })

  // Try to add StellarExpert tokens
  try {
    const assets = await getStellarExpertAssets()
    const stellarTokens = assets
      .map(convertToToken)
      .filter((token): token is Token => token !== null)
      .slice(0, 50)

    stellarTokens.forEach((token) => {
      // Use uppercase keys for consistency
      result[token.contract.toUpperCase()] = token
    })
  } catch (error) {
    console.warn(
      `[useCommonTokens] StellarExpert failed, using ${hardcodedTokens.length} hardcoded tokens only:`,
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
