import classNames from 'classnames'
import { FC, ReactNode } from 'react'

interface GradientWrapper {
  children: ReactNode
  className?: string
}

export const GradientWrapper: FC<GradientWrapper> = ({ children, className }) => {
  return (
    <div
      className={classNames(className, 'p-px')}
      style={{
        background: 'linear-gradient(103.72deg, #0993EC -6.18%, #F338C3 100%)',
      }}
    >
      {children}
    </div>
  )
}
