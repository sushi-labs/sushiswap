import { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return <div {...props} className={classNames(props.className, 'rounded-lg overflow-hidden shimmer')} />
}
