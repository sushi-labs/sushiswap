import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { PairWithBalance, PairWithFarmRewards } from '../../../types'

export interface CellProps {
  row: PairWithFarmRewards
}

export interface CellWithBalanceProps {
  row: PairWithBalance
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
