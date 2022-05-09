import React, { FC, TableHTMLAttributes } from 'react'

const HeadRow: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> = ({
  children,
  ...props
}) => (
  <tr {...props} className="w-full h-12 cursor-pointer bg-dark-850">
    {children}
  </tr>
)

export default HeadRow
