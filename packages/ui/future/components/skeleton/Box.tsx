import classNames from 'classnames'
import { FC, HTMLProps } from 'react'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        'rounded-lg overflow-hidden animate-pulse bg-black/[0.10] dark:bg-white/[0.10]'
      )}
    />
  )
}
