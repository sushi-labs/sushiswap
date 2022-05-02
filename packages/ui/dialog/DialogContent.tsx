import React, { FC, forwardRef } from 'react'
import classNames from 'classnames'

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
          'space-y-3 inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-dark-900 shadow-xl rounded-2xl',
        )}
      >
        {children}
      </div>
    )
  },
)

export default DialogContent
