import React, { FC, TableHTMLAttributes } from 'react'

const Body: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => (
  <tbody {...props} className="divide-y divide-dark-800">
    {children}
  </tbody>
)

export default Body
