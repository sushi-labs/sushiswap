import React, { FC } from 'react'
import classNames from 'classnames'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead {...props} className={classNames(className, 'border-b border-gray-200 dark:border-slate-200/5')}>
      {children}
    </thead>
  )
}

export default Head
