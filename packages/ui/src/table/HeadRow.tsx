import React, { FC } from 'react'

const HeadRow: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> = ({
  children,
  ...props
}) => (
  <tr {...props} className="w-full h-[52px]">
    {children}
  </tr>
)

export default HeadRow
