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
      'w-full hover:bg-gray-50 font-medium border-b border-gray-100 dark:border-slate-200/5 dark:hover:bg-slate-700/20'
    )}
  >
    {children}
  </tr>
)

export default Row
