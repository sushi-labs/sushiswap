import React, { FC } from 'react'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return (
    <thead {...props} className="bg-slate-800/30">
      {children}
    </thead>
  )
}

export default Head
