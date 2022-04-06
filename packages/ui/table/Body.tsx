import { FC, TableHTMLAttributes } from 'react'

const Body: FC<TableHTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <tbody {...props} className="divide-y divide-dark-800">
    {children}
  </tbody>
)

export default Body
