import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { KashiPair } from '../../.graphclient'

export interface CellProps {
  row: KashiPair
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
