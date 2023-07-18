import classNames from 'classnames'
import React, { forwardRef } from 'react'

import { WithTestDataId } from './types'

export interface RowProps
  extends WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> {
  rowHeight?: number
}

const Row = forwardRef<HTMLTableRowElement, RowProps>(function Row(
  { children, testId, className, rowHeight = 48, ...props },
  ref
) {
  return (
    <tr
      {...props}
      testdata-id={testId}
      ref={ref}
      className={classNames(
        className,
        'w-full hover:bg-secondary focus:bg-accent font-medium border-t border-gray-200 dark:!border-slate-200/5'
      )}
      style={{ height: rowHeight }}
    >
      {children}
    </tr>
  )
})

export default Row
