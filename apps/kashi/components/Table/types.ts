import { ColumnDef } from '@tanstack/react-table'
import { KashiMediumRiskLendingPairV1 } from 'lib/KashiPair'
import { ReactNode } from 'react'

export interface CellProps {
  row: KashiMediumRiskLendingPairV1
}

export type ExtendedColumnDef<C, P> = ColumnDef<C, P> & {
  skeleton: ReactNode
}
