import { aprToApy } from './convert'
import { formatPercent } from './format'

interface getApy {
  volume: number
  liquidity: number
  days: number
}

export const getApy = ({ volume, liquidity, days }: getApy) => {
  const apy = aprToApy((((volume / days) * 365 * 0.0025) / liquidity) * 100, 3650)
  if (apy > 1000) return '>10,000%'
  return formatPercent(apy)
}
