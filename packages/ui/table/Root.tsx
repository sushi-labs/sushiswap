import React, { FC } from 'react'

const Root: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
  children,
  ...props
}) => (
  <div className="overflow-hidden overflow-x-auto rounded-2xl z-10 shadow-md shadow-black/20">
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
