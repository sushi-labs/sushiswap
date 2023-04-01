import React, { FC } from 'react'

import { classNames } from '..'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, className, ...props }) => (
  <th
    {...props}
    className={classNames(
      className,
      'h-[52px] px-3 sm:px-4 text-xs text-gray-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap'
    )}
  >
    {children}
  </th>
)

export default HeadCell
