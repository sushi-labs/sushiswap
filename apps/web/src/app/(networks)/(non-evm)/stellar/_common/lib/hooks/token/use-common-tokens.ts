import { keepPreviousData, useQuery } from '@tanstack/react-query'
import ms from 'ms'
import { z } from 'zod'
import { staticTokens } from '~stellar/_common/lib/assets/token-assets'
import type { Token } from '~stellar/_common/lib/types/token.type'

const stellarExpertAssetSchema = z.object({
  code: z.string(),
  issuer: z.string(),
  contract: z.string(),
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

  const assets = parsed.data.assets
  return assets.filter(
    (i) => i.domain && !OUTDATED_TOKENS.has(`${i.code}|${i.domain}`),
  )
}

export const fetchCommonTokensQueryFn = async (): Promise<
  Record<string, Token>
> => {
  const result: Record<string, Token> = {}

  // Always include hardcoded tokens
  // Use uppercase keys for consistency (Stellar addresses are case-insensitive)
  staticTokens.forEach((token) => {
    result[token.contract.toUpperCase()] = token
  })

  // Try to add StellarExpert tokens
  try {
    const assets = await getStellarExpertAssets()
    assets.forEach((token) => {
      // Use uppercase keys for consistency
      result[token.contract.toUpperCase()] = token
    })
  } catch (error) {
    console.warn(
      `[useCommonTokens] StellarExpert failed, using ${staticTokens.length} hardcoded tokens only:`,
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
