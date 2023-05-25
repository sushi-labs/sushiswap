import React, { FC } from 'react'

import { default as tbody } from './Body'
import { default as td } from './Cell'
import { default as container, TableContainerProps } from './Container'
import { default as thead } from './Head'
import { default as th, HeadCellProps } from './HeadCell'
import { default as thr, HeadRowProps } from './HeadRow'
import { Paginator, PaginatorProps } from './Paginator'
import { default as table } from './Root'
import { default as tr } from './Row'
import { WithTestDataId } from './types'

export type TableProps = {
  container: FC<WithTestDataId<TableContainerProps>>
  thead: FC<
    WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  >
  table: FC<WithTestDataId<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>>
  tr: typeof tr
  thr: FC<WithTestDataId<HeadRowProps>>
  th: FC<WithTestDataId<HeadCellProps>>
  td: FC<
    WithTestDataId<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
  >
  tbody: FC<
    WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  >
  Paginator: FC<PaginatorProps>
}

export const Table: TableProps = {
  container,
  thead,
  table,
  tr,
  thr,
  th,
  td,
  tbody,
  Paginator,
}
