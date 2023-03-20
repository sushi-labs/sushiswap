import classNames from 'classnames'
import { FC, HTMLProps } from 'react'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return <div {...props} className={classNames(props.className, 'rounded-lg overflow-hidden shimmer')} />
}
