import classNames from 'classnames'
import React, { FC, TableHTMLAttributes } from 'react'

const HeadCell: FC<
  React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>
> = ({ children, className, ...props }) => (
  <td className={classNames('flex items-center px-4 overflow-hidden text-sm text-high-emphesis', className)} {...props}>
    {children}
  </td>
)

export default HeadCell
