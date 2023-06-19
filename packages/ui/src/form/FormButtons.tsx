import classNames from 'classnames'
import React, { FC, HTMLAttributes } from 'react'

interface FormButtons extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[]
}

export const FormButtons: FC<FormButtons> = ({ children, className }) => {
  return <div className={classNames('flex justify-end gap-4 pt-4', className)}>{children}</div>
}
