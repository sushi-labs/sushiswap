import React, { FC } from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, className, ...props }) => (
  <th
    {...props}
    className="h-[52px] px-3 sm:px-4 text-sm font-medium text-slate-400 hover:text-high-emphesis whitespace-nowrap"
  >
    {children}
  </th>
)

export default HeadCell
