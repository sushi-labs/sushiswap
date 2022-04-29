import { FC, TableHTMLAttributes } from 'react'

const HeadCell: FC<TableHTMLAttributes<HTMLTableCellElement>> = ({ children, ...props }) => (
  <td {...props} className="flex items-center overflow-hidden text-left text-sm text-high-emphesis px-4">
    {children}
  </td>
)

export default HeadCell
