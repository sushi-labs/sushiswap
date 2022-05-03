import { FC, TableHTMLAttributes } from 'react'

const HeadCell: FC<TableHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <th
    {...props}
    className="flex items-center h-12 px-4 text-xs font-bold border-b text-secondary border-dark-800 hover:text-high-emphesis"
  >
    {children}
  </th>
)

export default HeadCell
