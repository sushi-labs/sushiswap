import classNames from 'classnames'
import { FC } from 'react'

interface DotsProps {
  children?: any
  className?: string
}

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
