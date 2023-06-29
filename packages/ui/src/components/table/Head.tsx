import React, { FC } from 'react'
import classNames from 'classnames'
import { WithTestDataId } from './types'

const Head: FC<
  WithTestDataId<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>>
> = ({ children, className, testId, ...props }) => {
  return (
    <thead
      {...props}
      testdata-id={testId}
      className={classNames(className, 'border-b border-gray-200 dark:border-slate-200/5')}
    >
      {children}
    </thead>
  )
}

export default Head
