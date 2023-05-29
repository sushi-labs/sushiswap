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
        ...props.style,
        minWidth: props.radius,
        minHeight: props.radius,
        width: props.radius,
        height: props.radius,
      }}
      className={classNames(
        props.className,
        'rounded-full overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]'
      )}
    />
  )
}
