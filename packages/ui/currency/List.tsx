import { Type } from '@sushiswap/currency'
import React, { CSSProperties, FC, ReactElement, useCallback } from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'

interface RendererPayload {
  currency: Type
  style: CSSProperties
}

export interface ListProps {
  className?: string
  currencies: Type[]
  rowHeight?: number
  rowRenderer(payload: RendererPayload): ReactElement
}

export const List: FC<ListProps> = ({ className, currencies, rowHeight, rowRenderer }) => {
  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const currency = currencies[index]
      return rowRenderer({ currency, style })
    },
    [currencies, rowRenderer]
  )

  return (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => (
        <FixedSizeList
          height={height}
          width={width}
          itemCount={currencies.length}
          itemSize={rowHeight || 48}
          className={className}
        >
          {Row}
        </FixedSizeList>
      )}
    </AutoSizer>
  )
}
