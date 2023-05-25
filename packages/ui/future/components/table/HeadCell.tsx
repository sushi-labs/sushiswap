import React, { FC } from 'react'
import classNames from 'classnames'
import { WithTestDataId } from './types'

export interface HeadCellProps
  extends WithTestDataId<
    React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
  > {
  headRowHeight?: number
}
const HeadCell: FC<HeadCellProps> = ({ children, testId, className, headRowHeight = 48, ...props }) => (
  <th
    {...props}
    testdata-id={testId}
    className={classNames(
      className,
      'px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap'
    )}
    style={{ height: headRowHeight }}
  >
    {children}
  </th>
)

export default HeadCell
