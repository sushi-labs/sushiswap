import React, { FC, forwardRef } from 'react'
import classNames from 'classnames'

export interface RowProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  size?: 'default' | 'lg'
}

const Row = forwardRef<HTMLTableRowElement, RowProps>(function Row(
  { children, className, size = 'default', ...props },
  ref
) {
  return (
    <tr
      {...props}
      ref={ref}
      className={classNames(
        className,
        size === 'default' ? 'h-[62px]' : 'h-[72px]',
        'w-full hover:bg-gray-50 dark:hover:bg-gray-700/20 font-medium border-t border-gray-200 dark:!border-slate-200/5'
      )}
    >
      {children}
    </tr>
  )
})

export default Row
