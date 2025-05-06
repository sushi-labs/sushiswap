import classNames from 'classnames'
import type { FC, ReactElement } from 'react'

interface Badge {
  badgeContent: ReactElement
  children: ReactElement
  className?: string
  position?: 'top-left' | 'bottom-right' | 'top-right' | 'bottom-left'
}

export const Badge: FC<Badge> = ({
  badgeContent,
  position = 'top-left',
  children,
  className,
}) => {
  return (
    <div className="relative">
      <div
        className={classNames(
          className,
          'absolute z-10',
          position === 'top-left'
            ? '-left-[25%] -top-[15%]'
            : position === 'bottom-right'
              ? '-right-[25%] -bottom-[15%]'
              : position === 'top-right'
                ? '-right-[25%] -top-[15%]'
                : position === 'bottom-left'
                  ? '-left-[25%] -bottom-[15%]'
                  : '',
        )}
      >
        {badgeContent}
      </div>
      {children}
    </div>
  )
}
