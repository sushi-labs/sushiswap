import type { AllPerpMetasResponse } from '@nktkas/hyperliquid'

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
