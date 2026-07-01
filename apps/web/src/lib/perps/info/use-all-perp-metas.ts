import type { AllPerpMetasResponse } from '@nktkas/hyperliquid'
import { allPerpMetas } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import { hlHttpTransport } from '../transports'

type PerpMeta = AllPerpMetasResponse[number]

export function getPerpMetaForDex(
  perpMetas: AllPerpMetasResponse | undefined,
  dexNameRaw: string,
): PerpMeta | undefined {
  if (!perpMetas) return undefined

  const dexName = dexNameRaw.toLowerCase()
  if (dexName === '') return perpMetas[0]

  return perpMetas.find((meta) => {
    return meta.universe?.some((asset) => {
      const [metaDexName, assetName] = asset.name.split(':')
      return assetName !== undefined && metaDexName.toLowerCase() === dexName
    })
  })
}

export function getCollateralTokenForDex(
  perpMetas: AllPerpMetasResponse | undefined,
  dexName: string,
): number | undefined {
  return getPerpMetaForDex(perpMetas, dexName)?.collateralToken
}

export const useAllPerpMetas = () => {
  return useQuery({
    queryKey: ['all-perp-metas'],
    queryFn: async () => {
      return await allPerpMetas({
        transport: hlHttpTransport,
      })
    },
  })
}
