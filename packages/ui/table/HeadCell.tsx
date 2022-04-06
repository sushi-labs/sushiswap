import { FC, TableHTMLAttributes } from 'react'

const HeadCell: FC<TableHTMLAttributes<HTMLTableHeaderCellElement>> = ({ children, ...props }) => (
  <th
    {...props}
    className="flex items-center text-left text-xs font-bold text-secondary h-12 border-b border-dark-800 px-4 hover:text-high-emphesis"
  >
    {children}
  </th>
)

export default HeadCell
