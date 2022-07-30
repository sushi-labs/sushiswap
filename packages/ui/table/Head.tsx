import React, { FC } from 'react'

const Head: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableSectionElement>, HTMLTableSectionElement>> = ({
  children,
  ...props
}) => {
  return (
    <thead {...props} className="bg-white bg-opacity-[0.08]">
      {children}
    </thead>
  )
}

export default Head
