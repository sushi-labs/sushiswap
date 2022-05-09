import React, { FC } from 'react'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return (
    <thead {...props} className="bg-dark-800/40">
      {children}
    </thead>
  )
}

export default Head
