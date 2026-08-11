'use client'

import type React from 'react'
import {
  type CSSProperties,
  type FC,
  type ReactElement,
  useCallback,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

type RowCallback<_TData> = (row: {
  index: number
  style: CSSProperties
}) => ReactElement

export interface ListProps<TData> {
  className?: string
  rowHeight?: number
  rowRenderer: FC<TData>
  rowData: TData[]
}

export type ListComponent = <TData>(
  props: ListProps<TData>,
) => React.ReactElement | null

export function List<TData>({
  className,
  rowHeight,
  rowData,
  rowRenderer: RowComponent,
}: ListProps<TData>) {
  const Row = useCallback<RowCallback<TData>>(
    ({ index, style }) => {
      return <RowComponent style={style} {...rowData[index]} />
    },
    [RowComponent, rowData],
  )

  return (
    <AutoSizer disableWidth>
      {({ height }: { height: number }) => (
        <FixedSizeList
          width="100%"
          height={height}
          itemCount={rowData.length}
          itemSize={rowHeight || 48}
          className={className}
          style={{ overflow: 'overlay' }}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}
