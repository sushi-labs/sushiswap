import React, { FC } from 'react'

const Body: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => (
  <tbody {...props} className="divide-y divide-slate-200/5">
    {children}
  </tbody>
)

export default Body
