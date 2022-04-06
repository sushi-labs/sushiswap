import { FC, TableHTMLAttributes } from 'react'

const Row: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props} className="hover:bg-dark-800/30 w-full cursor-pointer h-12">
    {children}
  </tr>
)

export default Row
