import React, { FC } from 'react'

export interface HeadRowProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  headRowHeight?: number
}

const HeadRow: FC<HeadRowProps> = ({ children, headRowHeight = 48, ...props }) => (
  <tr {...props} className="w-fulls" style={{ height: headRowHeight }}>
    {children}
  </tr>
)

export default HeadRow
