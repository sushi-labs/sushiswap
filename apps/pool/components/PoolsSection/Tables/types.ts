import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { Pair } from '../../../.graphclient'
import { PairWithBalance } from '../../../types'

export interface CellProps {
  row: Pair
}

export interface CellWithBalanceProps {
  row: PairWithBalance
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
