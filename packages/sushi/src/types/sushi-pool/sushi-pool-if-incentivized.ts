import type { SushiPoolBase } from 'sushi/types'

export type SushiPoolIfIncentivized<T extends SushiPoolBase> = T & {
  isIncentivized: boolean
  wasIncentivized: boolean
}
