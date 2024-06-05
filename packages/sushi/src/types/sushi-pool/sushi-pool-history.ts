import { SushiPoolBase } from 'sushi/types'

export type SushiPoolHistory<T extends SushiPoolBase> = T & {
  liquidityUSD1dChange: number

  volumeUSD1d: number
  volumeUSD1dChange: number

  feesUSD1d: number
  feesUSD1dChange: number

  txCount1d: number
  txCount1dChange: number
}
