import React, { FC } from 'react'
import classNames from 'classnames'
import { WithTestDataId } from './types'

const Root: FC<
  WithTestDataId<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>>
> = ({ className, children, testId, ...props }) => (
  <div testdata-id={testId} className={classNames(className, 'overflow-auto scroll z-10')}>
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
