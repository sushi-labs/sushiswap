import React, { FC } from 'react'

import { classNames } from '..'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead {...props} className={classNames(className, 'border-b border-gray-100')}>
      {children}
    </thead>
  )
}

export default Head
