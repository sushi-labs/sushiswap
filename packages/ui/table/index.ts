import { default as container } from './Container'
import { default as thead } from './Head'
import { default as table } from './Root'
import { default as tr } from './Row'
import { default as th } from './HeadCell'
import { default as td } from './Cell'
import { default as tbody } from './Body'
import { default as thr } from './HeadRow'
import { FC } from 'react'

export type TableProps = {
  container: FC<{}>
  thead: FC<{}>
  table: FC<{}>
  tr: FC<{}>
  thr: FC<{}>
  th: FC<{}>
  td: FC<{}>
  tbody: FC<{}>
}

export const Table: TableProps = { container, thead, table, tr, thr, th, td, tbody }
