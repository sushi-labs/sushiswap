import React, { FC } from 'react'
import { default as tbody } from './Body'
import { default as td } from './Cell'
import { default as container, TableContainerProps } from './Container'
import { default as thead } from './Head'
import { default as th } from './HeadCell'
import { default as thr } from './HeadRow'
import { Paginator, PaginatorProps } from './Paginator'
import { default as table } from './Root'
import { default as tr, RowProps } from './Row'

export type TableProps = {
  container: FC<TableContainerProps>
  thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  table: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>
  tr: FC<RowProps>
  thr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>
  th: FC<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>
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
