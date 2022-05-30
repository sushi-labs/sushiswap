import { TokenType } from 'features/onsen/context/types'

const SUSHI_LP_TOKEN = 'Sushi LP Token'
const SUSHISWAP_LP_TOKEN = 'SushiSwap LP Token'
const KASHI_MEDIUM_RISK = 'Kashi Medium Risk'

export function getFarmType(name: string): TokenType {
  if (isTridentPool(name)) return TokenType.TRIDENT
  else if (isLegacyPair(name)) return TokenType.LEGACY
  else if (isKashiPair(name)) return TokenType.KASHI
  else return TokenType.TOKEN
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
