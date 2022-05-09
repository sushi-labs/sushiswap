import React, { FC } from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>
> = ({ children, ...props }) => (
  <th
    {...props}
    className="flex items-center h-12 px-4 text-xs font-bold border-b text-secondary border-dark-800 hover:text-high-emphesis"
  >
    {children}
  </th>
)

export default HeadCell
