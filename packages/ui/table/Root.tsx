import React, { FC } from 'react'

import { classNames } from '../index'

const Root: FC<React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={classNames(
      className,
      'overflow-hidden overflow-x-auto scroll rounded-xl sm:rounded-2xl z-10 bg-white dark:bg-slate-800'
    )}
  >
    <table {...props} className="w-full border-collapse">
      {children}
    </table>
  </div>
)

export default Root
