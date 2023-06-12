import React, { FC } from 'react'
import { WithTestDataId } from './types'

export interface HeadRowProps
  extends WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> {
  headRowHeight?: number
}

const HeadRow: FC<HeadRowProps> = ({ children, testId, headRowHeight = 48, ...props }) => (
  <tr {...props} testdata-id={testId} className="w-fulls" style={{ height: headRowHeight }}>
    {children}
  </tr>
)

export default HeadRow
