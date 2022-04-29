import { FC, TableHTMLAttributes } from 'react'

const Head: FC<TableHTMLAttributes<HTMLTableSectionElement>> = ({ children, ...props }) => (
  <thead {...props} className="bg-dark-800/40">
    {children}
  </thead>
)

export default Head
