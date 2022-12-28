import classNames from 'classnames'
import React, { FC, forwardRef } from 'react'

export interface DialogContentProps {
  className?: string
  children?: React.ReactNode
}

const DialogContent: FC<DialogContentProps> = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          className,
          'p-3 overflow-hidden text-left max-w-md inline-block w-full h-full bg-gray-100 dark:bg-slate-900 shadow-xl align-middle transition-all transform rounded-t-2xl rounded-b-none sm:rounded-2xl relative'
        )}
      >
        {children}
      </div>
    )
  }
)

export default DialogContent
