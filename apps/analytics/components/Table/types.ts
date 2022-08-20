import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { Pair } from '../../.graphclient'

export interface CellProps {
  row: Pair
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
