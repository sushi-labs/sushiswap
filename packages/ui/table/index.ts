import React, { FC } from 'react'

import { default as container, TableContainerProps } from './Container'
import { default as thead } from './Head'
import { default as table } from './Root'
import { default as tr } from './Row'
import { default as th } from './HeadCell'
import { default as td } from './Cell'
import { default as tbody } from './Body'
import { default as thr } from './HeadRow'

export type TableProps = {
  container: FC<TableContainerProps>
  thead: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
  table: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>
  tr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>
  thr: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>>
  th: FC<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>>
  td: FC<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
  tbody: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
}

export const Table: TableProps = { container, thead, table, tr, thr, th, td, tbody }
