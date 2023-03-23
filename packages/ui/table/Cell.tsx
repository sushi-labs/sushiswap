import classNames from 'classnames'
import React, { FC } from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>
> = ({ children, className, ...props }) => (
  <td
    className={classNames(
      'h-[52px] px-3 sm:px-4 overflow-hidden text-sm dark:text-slate-200 text-gray-700 whitespace-nowrap',
      className
    )}
    {...props}
  >
    {children}
  </td>
)

export default HeadCell
