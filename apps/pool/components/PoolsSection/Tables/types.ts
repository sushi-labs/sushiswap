import { Pair } from '@sushiswap/graph-client/.graphclient'

import { PairWithBalance } from '../../../types'

export interface CellProps {
  row: Pair
}

export interface CellWithBalanceProps {
  row: PairWithBalance
}
