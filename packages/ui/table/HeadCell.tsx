import React, { FC } from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, ...props }) => (
  <th
    {...props}
    className="h-12 px-4 text-xs font-bold border-b border-slate-800 text-slate-300 hover:text-high-emphesis"
  >
    {children}
  </th>
)

export default HeadCell
