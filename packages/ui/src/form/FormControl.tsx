import React, { FC } from 'react'

import { classNames } from '../index'
import { Typography } from '../typography'

interface FormControl {
  label: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export const FormControl: FC<FormControl> = ({ className, label, children, disabled = false }) => {
  return (
    <div
      aria-disabled={disabled}
      className={classNames(className, disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-2')}
    >
      <Typography variant="sm" weight={500} className="text-slate-200">
        {label}
      </Typography>
      {children}
    </div>
  )
}
