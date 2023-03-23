import React, { FC } from 'react'
import classNames from 'classnames'

const Root: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={classNames(className, 'overflow-hidden overflow-x-auto scroll z-10')}>
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
