import { PoolId } from 'sushi/types'

export type PoolHistory<T extends PoolId = PoolId> = T & {
  liquidityUSD1dChange: number
  liquidityUSD1wChange: number

  volumeUSD1d: number
  volumeUSD1dChange: number | null
  volumeUSD1w: number

  feesUSD1d: number
  feesUSD1dChange: number | null
  feesUSD1w: number

  txCount1d: number
  txCount1dChange: number | null
  txCount1w: number
}
