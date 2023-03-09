export type Row<T> = { row: T }

import { Pair, Token } from '@sushiswap/graph-client'

export interface CellProps {
  row: Pair
}

export interface TokenCellProps {
  row: Token
}
