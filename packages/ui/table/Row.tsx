import React, { FC } from 'react'

import { classNames } from '../index'

const Row: FC<React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => (
  <tr
    {...props}
    className={classNames(
      className,
      'w-full bg-white even:bg-opacity-[0.04] odd:bg-opacity-[0.02] hover:opacity-[0.85]'
    )}
  >
    {children}
  </tr>
)

export default Row
