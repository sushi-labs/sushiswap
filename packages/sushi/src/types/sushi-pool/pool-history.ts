import { PoolId } from 'sushi/types'

export type PoolHistory<T extends PoolId = PoolId> = T & {
  liquidityUSD1dChange: number

  volumeUSD1d: number
  volumeUSD1dChange: number

  feesUSD1d: number
  feesUSD1dChange: number

  txCount1d: number
  txCount1dChange: number
}
