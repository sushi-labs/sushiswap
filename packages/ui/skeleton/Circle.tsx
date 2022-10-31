import { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export interface CircleProps extends HTMLProps<HTMLDivElement> {
  radius: number
}

export const Circle: FC<CircleProps> = (props) => {
  return (
    <div
      {...props}
      style={{ minWidth: props.radius, minHeight: props.radius, width: props.radius, height: props.radius }}
      className={classNames(props.className, 'rounded-full overflow-hidden shimmer')}
    />
  )
}
