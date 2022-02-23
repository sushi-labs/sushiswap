import { FC, forwardRef } from 'react'
import { classNames } from '../lib/classNames'

export interface DialogContentProps {
  className?: string
}

const DialogContent: FC<DialogContentProps> = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          className,
          'space-y-3 inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform ring-1 ring-slate-900/5 bg-white dark:bg-slate-800 shadow-xl rounded-2xl',
        )}
      >
        {children}
      </div>
    )
  },
)

export default DialogContent
