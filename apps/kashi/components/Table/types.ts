import { ColumnDef } from '@tanstack/react-table'
import { ReactNode } from 'react'

import { KashiPair as KashiPairDTO } from '../../.graphclient'

export interface CellProps {
  row: KashiPairDTO
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
