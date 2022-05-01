import classNames from 'classnames'
import { FC, TableHTMLAttributes } from 'react'

const HeadCell: FC<TableHTMLAttributes<HTMLTableCellElement>> = ({ children, className, ...props }) => (
  <td
    className={classNames('flex items-center px-4 overflow-hidden text-sm text-left text-high-emphesis', className)}
    {...props}
  >
    {children}
  </td>
)

export default HeadCell
