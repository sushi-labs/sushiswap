import { classNames } from '@sushiswap/ui'
import { FC, ReactNode } from 'react'

interface GradientWrapper {
  children: ReactNode
  className?: string
}

export const GradientWrapper: FC<GradientWrapper> = ({
  children,
  className,
}) => {
  return (
    <div
      className={classNames(
        className,
        'p-px bg-[linear-gradient(103.72deg,#0993EC_-6.18%,#F338C3_100%)]',
      )}
    >
      {children}
    </div>
  )
}
