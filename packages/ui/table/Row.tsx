import { FC, TableHTMLAttributes } from 'react'

const Row: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props} className="w-full h-12 cursor-pointer hover:bg-dark-800/30">
    {children}
  </tr>
)

export default Row
