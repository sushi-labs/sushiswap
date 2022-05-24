import { FarmType } from 'features/onsen/context/types'

const SUSHI_LP_TOKEN = 'Sushi LP Token'
const SUSHISWAP_LP_TOKEN = 'SushiSwap LP Token'
const KASHI_MEDIUM_RISK = 'Kashi Medium Risk'

export function getFarmType(name: string): FarmType {
  if (isTridentPool(name)) return FarmType.TRIDENT
  else if (isLegacyPair(name)) return FarmType.LEGACY
  else if (isKashiPair(name)) return FarmType.KASHI
  else return FarmType.TOKEN
}

function isTridentPool(name: string): boolean {
  return name === SUSHI_LP_TOKEN
}

function isLegacyPair(name: string): boolean {
  return name === SUSHISWAP_LP_TOKEN
}

function isKashiPair(name: string): boolean {
  return name.startsWith(KASHI_MEDIUM_RISK)
}
