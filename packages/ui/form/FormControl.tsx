import React, { FC } from 'react'

import { classNames } from '../index'
import { Typography } from '../typography'

interface FormControl {
  label: string
  children: React.ReactNode
  disabled?: boolean
}

export const FormControl: FC<FormControl> = ({ label, children, disabled = false }) => {
  return (
    <div
      aria-disabled={disabled}
      className={classNames(disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-2')}
    >
      <Typography variant="sm" weight={500} className="text-slate-200">
        {label}
      </Typography>
      {children}
    </div>
  )
}
