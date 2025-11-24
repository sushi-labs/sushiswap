import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { tokens } from '~stellar/_common/lib/assets/token-assets'
import { NETWORK_NAME } from '~stellar/_common/lib/constants'
import type { Token } from '~stellar/_common/lib/types/token.type'

const stellarExpertAssetSchema = z.object({
  code: z.string(),
  issuer: z.string().optional(),
  contract: z.string().optional(),
})

const stellarExpertResponseSchema = z.array(stellarExpertAssetSchema)

const getStellarExpertAssets = async (
  network: typeof NETWORK_NAME,
): Promise<z.infer<typeof stellarExpertAssetSchema>[]> => {
  const apiUrl =
    network === 'mainnet'
      ? 'https://api.stellar.expert/explorer/public/asset-list/top50'
      : 'https://api.stellar.expert/explorer/testnet/asset-list/top50'

  const response = await fetch(apiUrl, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`StellarExpert API error: ${response.status}`)
  }

  const data = await response.json()
  const assets: unknown[] = Array.isArray(data)
    ? data
    : data &&
        typeof data === 'object' &&
        'data' in data &&
        Array.isArray(data.data)
      ? data.data
      : data &&
          typeof data === 'object' &&
          'assets' in data &&
          Array.isArray(data.assets)
        ? data.assets
        : []

  const validAssets = assets.filter(
    (asset): asset is Record<string, unknown> =>
      typeof asset === 'object' &&
      asset !== null &&
      'code' in asset &&
      typeof asset.code === 'string',
  )

  return stellarExpertResponseSchema.parse(validAssets)
}

const convertToToken = (
  asset: z.infer<typeof stellarExpertAssetSchema>,
): Token | null => {
  if (!asset.contract || asset.contract.length === 0) {
    return null
  }

  return {
    code: asset.code,
    issuer: asset.issuer || '',
    contract: asset.contract,
    name: asset.code,
    org: 'unknown',
    decimals: 7,
  }
}

const getHardcodedTokens = (network: typeof NETWORK_NAME): Token[] => {
  return tokens[network]
    .filter((token) => token.contract && token.contract.length > 0)
    .slice(0, 50)
}

const fetchCommonTokensQueryFn = async ({
  network,
}: {
  network: typeof NETWORK_NAME
}): Promise<Record<string, Token>> => {
  const result: Record<string, Token> = {}

  // Always include hardcoded tokens
  const hardcodedTokens = getHardcodedTokens(network)
  hardcodedTokens.forEach((token) => {
    result[token.contract] = token
  })

  // Try to add StellarExpert tokens
  try {
    const assets = await getStellarExpertAssets(network)
    const stellarTokens = assets
      .map(convertToToken)
      .filter((token): token is Token => token !== null)
      .slice(0, 50)

    stellarTokens.forEach((token) => {
      result[token.contract] = token
    })

    console.log(
      `[useCommonTokens] Fetched ${hardcodedTokens.length} hardcoded + ${stellarTokens.length} StellarExpert = ${Object.keys(result).length} total tokens`,
    )
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
    queryKey: ['common-tokens', { network: NETWORK_NAME }],
    queryFn: () => fetchCommonTokensQueryFn({ network: NETWORK_NAME }),
    placeholderData: keepPreviousData,
    staleTime: 3600000,
    gcTime: 86400000,
    retry: 1,
  })
}
