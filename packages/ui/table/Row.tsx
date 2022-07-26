import React, { FC } from 'react'

const Row: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> = ({
  children,
  ...props
}) => (
  <tr {...props} className="w-full even:bg-slate-800/30">
    {children}
  </tr>
)

export default Row
