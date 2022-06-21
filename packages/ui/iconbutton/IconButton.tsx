import { FC, HTMLProps, ReactNode } from 'react'

import { classNames } from '../index'

interface IconButton extends HTMLProps<HTMLButtonElement> {
  children: ReactNode
  className?: string
}

export const IconButton: FC<IconButton> = ({ children, className, ...rest }) => {
  return (
    <button {...rest} type="button" className={classNames(className, 'group relative')}>
      <span className="rounded-full absolute inset-0 -ml-1 -mr-1 -mb-1 -mt-1 group-hover:bg-white group-hover:bg-opacity-[0.08]" />
      {children}
    </button>
  )
}
