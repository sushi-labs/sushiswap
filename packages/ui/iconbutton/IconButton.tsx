import { FC, HTMLProps, ReactNode } from 'react'

import { classNames } from '../index'

interface IconButton extends HTMLProps<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export const IconButton: FC<IconButton> = ({ children, className }) => {
  return (
    <button
      type="button"
      className={classNames(className, 'p-1 -mt-1 -mr-1 rounded-full hover:bg-white hover:bg-opacity-[0.08]')}
    >
      {children}
    </button>
  )
}
