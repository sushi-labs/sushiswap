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

export type TableProps = {
  container: FC<TableContainerProps>
  thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  table: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>
  tr: typeof tr
  thr: FC<HeadRowProps>
  th: FC<HeadCellProps>
  td: FC<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
  tbody: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
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
