import React, { FC } from 'react'

import { classNames } from '../index'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, className, ...props }) => (
  <th
    {...props}
    className={classNames(
      className,
      'h-12 px-3 sm:px-4 text-sm font-medium text-slate-400 hover:text-high-emphesis whitespace-nowrap'
    )}
  >
    {children}
  </th>
)

export default HeadCell
