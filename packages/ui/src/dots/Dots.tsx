import { FC } from 'react'

import { classNames } from '../index'

interface DotsProps {
  children?: any
  className?: string
}

/**
 * @deprecated
 */
export const Dots: FC<DotsProps> = ({ children = <span />, className }) => {
  return (
    <span
      className={classNames(
        "after:inline-block after:content-['.'] after:animate-ellipsis after:w-4 after:text-left",
        className
      )}
    >
      {children}
    </span>
  )
}

export default Dots
