import classNames from 'classnames'
import React, { FC } from 'react'
import { WithTestDataId } from './types'

const HeadCell: FC<
  WithTestDataId<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>>
> = ({ children, testId, className, ...props }) => (
  <td
    testdata-id={testId}
    className={classNames(
      'h-[62px] px-3 sm:px-4 overflow-hidden text-sm dark:text-slate-200 text-gray-700 whitespace-nowrap',
      className
    )}
    {...props}
  >
    {children}
  </td>
)

export default HeadCell
