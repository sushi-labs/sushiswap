import React, { FC } from 'react'

import { classNames } from '..'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <thead {...props} className={classNames(className, 'bg-slate-800')}>
      {children}
    </thead>
  )
}

export default Head
