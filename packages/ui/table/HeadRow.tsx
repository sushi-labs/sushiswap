import { FC, TableHTMLAttributes } from 'react'

const HeadRow: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props} className="bg-dark-850 w-full cursor-pointer h-12">
    {children}
  </tr>
)

export default HeadRow
