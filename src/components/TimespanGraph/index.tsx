// @ts-ignore TYPE NEEDS FIXING
import AutoSizer from 'react-virtualized-auto-sizer'

import Curves from './Curves'

export interface TimespanGraphProps {
  compact?: boolean
  data: any
  title?: string
  labels?: string[]
  timespans?: {
    text: string
    length: number
  }[]
  defaultTimespan?: string
  colors?: any[]
  margin?: { top: number; right: number; bottom: number; left: number }
}

export default function TimespanGraph(props: TimespanGraphProps) {
  return (
    <>
      {props.data && props.data[0]?.length !== 0 && (
        // @ts-ignore TYPE NEEDS FIXING
        <AutoSizer>{({ width, height }) => <Curves {...props} width={width} height={height} />}</AutoSizer>
      )}
    </>
  )
}
