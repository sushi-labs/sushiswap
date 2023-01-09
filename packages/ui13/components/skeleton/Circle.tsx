import classNames from 'classnames'
import { FC, HTMLProps } from 'react'

export interface CircleProps extends HTMLProps<HTMLDivElement> {
  radius: number
}

export const Circle: FC<CircleProps> = (props) => {
  return (
    <div
      {...props}
      style={{
        minWidth: props.radius,
        minHeight: props.radius,
        width: props.radius,
        height: props.radius,
      }}
      className={classNames(props.className, 'bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden shimmer')}
    />
  )
}
