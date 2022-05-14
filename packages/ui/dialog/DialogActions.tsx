import classNames from 'classnames'
import React, { FC, ReactNode } from 'react'

export interface DialogActionProps {
  className?: string
  children: ReactNode[]
}

const DialogActions: FC<DialogActionProps> = ({ children, className }) => {
  return <div className={classNames(className, 'flex flex-col sm:flex-row-reverse gap-3 pt-2')}>{children}</div>
}

export default DialogActions
