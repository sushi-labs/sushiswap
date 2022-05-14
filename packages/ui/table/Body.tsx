import React, { FC } from 'react'

const Body: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => (
  <tbody {...props} className="divide-y divide-slate-800">
    {children}
  </tbody>
)

export default Body
