import React, { FC } from 'react'
import { WithTestDataId } from './types'

const Body: FC<
  WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
> = ({ children, testId, ...props }) => (
  <tbody {...props} testdata-id={testId} className="">
    {children}
  </tbody>
)

export default Body
