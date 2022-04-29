import { FC, TableHTMLAttributes } from 'react'

const Root: FC<TableHTMLAttributes<HTMLTableElement>> = ({ children, ...props }) => (
  <table {...props} className="w-full border-collapse">
    {children}
  </table>
)

export default Root
