import { FC, HTMLProps } from 'react'

import { classNames } from '../index'

export const Box: FC<HTMLProps<HTMLDivElement>> = (props) => {
  return (
    <div
      {...props}
      className={classNames(
        props.className,
        'relative',
        "rounded-lg overflow-hidden after:absolute after:inset-0 after:translate-x-[-100%] after:animate-wave after:content-[''] after:bg-shimmer-gradient"
      )}
    />
  )
}
