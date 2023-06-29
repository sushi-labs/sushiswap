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
          'p-4 overflow-hidden text-left max-w-md inline-block w-full h-full bg-gray-50/80 paper dark:bg-slate-800/80 shadow-xl align-middle transition-all transform rounded-t-2xl rounded-b-none sm:rounded-2xl relative'
        )}
      >
        {children}
      </div>
    )
  }
)

export default DialogContent
