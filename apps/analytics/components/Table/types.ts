import { Pair, Token } from '@sushiswap/graph-client'
import { Transaction } from '.graphclient'

export interface CellProps {
  row: Pair
}

export interface TokenCellProps {
  row: Token
}

export interface TransactionCellProps {
  row: Transaction
}
