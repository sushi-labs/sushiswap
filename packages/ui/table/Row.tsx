import React, { FC } from 'react'

import { classNames } from '../index'

export interface RowProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLTableRowElement>, HTMLTableRowElement> {
  size?: 'default' | 'lg'
}

const Row: FC<RowProps> = ({ children, className, size = 'default', ...props }) => (
  <tr
    {...props}
    className={classNames(
      className,
      size === 'default' ? 'h-[52px]' : 'h-[72px]',
      'w-full even:bg-white even:bg-opacity-[0.04] hover:opacity-[0.85]'
    )}
  >
    {children}
  </tr>
)

export default Row
