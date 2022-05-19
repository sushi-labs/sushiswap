import classNames from 'classnames'
import React from 'react'

type Props = {
  children?: React.ReactNode
  className?: string
  backdrop?: React.ReactNode
}

export function Glow({
  children,
  className = 'from-pink/5 to-blue/5 bg-gradient-radial',
  backdrop,
}: Props): JSX.Element {
  return (
    <div className="relative w-full">
      <div className={classNames(className, 'fixed inset-0 z-0 pointer-events-none')}>{backdrop}</div>
      <div className="relative filter">{children}</div>
    </div>
  )
}

export default Glow
