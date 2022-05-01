import { FC } from 'react'

import { default as container, TableContainerProps } from './Container'
import { default as thead, TableHeadProps } from './Head'
import { default as table } from './Root'
import { default as tr } from './Row'
import { default as th } from './HeadCell'
import { default as td } from './Cell'
import { default as tbody } from './Body'
import { default as thr } from './HeadRow'

export type TableProps = {
  container: FC<TableContainerProps>
  thead: FC<TableHeadProps>
  table: FC<{
    children?: React.ReactNode
  }>
  tr: FC<{
    children?: React.ReactNode
  }>
  thr: FC<{
    children?: React.ReactNode
  }>
  th: FC<{
    children?: React.ReactNode
  }>
  td: FC<{
    children?: React.ReactNode
  }>
  tbody: FC<{
    children?: React.ReactNode
  }>
}

export const Table: TableProps = { container, thead, table, tr, thr, th, td, tbody }
