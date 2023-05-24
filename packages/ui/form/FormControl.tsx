import React, { FC } from 'react'

import { classNames } from '../index'

interface FormControl {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export const FormControl: FC<FormControl> = ({ className, children, disabled = false }) => {
  return (
    <div
      aria-disabled={disabled}
      className={classNames(className, disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-2')}
    >
      {children}
    </div>
  )
}
