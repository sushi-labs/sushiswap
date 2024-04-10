import { formatUnits } from 'viem'

export const divBigIntToNumber = (value: bigint, decimals: number): number =>
  Number(formatUnits(value, decimals))

/**
 * Formula source: http://www.linked8.com/blog/158-apy-to-apr-and-apr-to-apy-calculation-methodologies
 *
 * @param apr {Number} APR as percentage (ie. 5.82)
 * @param frequency {Number} Compounding frequency (times a year)
 * @returns {Number} APY as percentage (ie. 6 for APR of 5.82%)
 */
export const aprToApy = (apr: number | string, frequency: number) =>
  ((1 + Number(apr) / 100 / frequency) ** frequency - 1) * 100
