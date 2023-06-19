import classNames from 'classnames'
import { FC, ReactElement } from 'react'

interface Badge {
  badgeContent: ReactElement
  children: ReactElement
  className?: string
}

/**
 * @deprecated
 */
export const Badge: FC<Badge> = ({ badgeContent, children, className }) => {
  return (
    <div className="relative">
      <div className={classNames(className, 'absolute -right-[25%] -top-[15%] z-10')}>{badgeContent}</div>
      {children}
    </div>
  )
}
