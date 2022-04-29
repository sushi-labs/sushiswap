import { FC, TableHTMLAttributes } from 'react'

const HeadRow: FC<TableHTMLAttributes<HTMLTableRowElement>> = ({ children, ...props }) => (
  <tr {...props} className="w-full h-12 cursor-pointer bg-dark-850">
    {children}
  </tr>
)

export default HeadRow
