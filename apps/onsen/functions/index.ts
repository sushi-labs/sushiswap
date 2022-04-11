const SUSHI_LP_TOKEN = 'Sushi LP Token'
const SUSHISWAP_LP_TOKEN = 'SushiSwap LP Token'
const KASHI_MEDIUM_RISK = 'Kashi Medium Risk'

export function isTridentPool(name: string): boolean {
  return name === SUSHI_LP_TOKEN
}

export function isLegacyPair(name: string): boolean {
  return name === SUSHISWAP_LP_TOKEN
}

export function isKashiPair(name: string): boolean {
  return name.startsWith(KASHI_MEDIUM_RISK)
}
