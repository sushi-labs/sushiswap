import classNames from 'classnames'
import { FC, HTMLProps } from 'react'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={classNames(props.className, 'bg-gray-200 dark:bg-slate-700 rounded-lg overflow-hidden shimmer')}
    />
  )
}
