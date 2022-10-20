import * as React from 'react'

type Props = {
  children: ({ index }: { index: number }) => React.ReactNode
  direction?: "toRight" | "toLeft",
  mode?: "chain" | "await" | "smooth",
  move?: boolean,
  offset?: number | "run-in" | string,
  speed?: number,
  height?: number | string,
  onNext?: (index: any) => void,
  onFinish?: () => void
}

export default class Ticker extends React.Component<Props> {}
