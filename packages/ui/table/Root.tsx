import React, { FC } from 'react'

const Root: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
  children,
  ...props
}) => (
  <table {...props} className="w-full border-collapse">
    {children}
  </table>
)

export default Root
