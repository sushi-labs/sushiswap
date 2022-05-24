import classNames from 'classnames'
import React from 'react'

type Props = {
  children?: React.ReactNode
  className?: string
}

export function Glow({ children, className }: Props): JSX.Element {
  return (
    <div className={classNames(className, 'relative w-full')}>
      <div className={classNames('from-pink/5 to-blue/5 fixed inset-0 bg-gradient-radial z-0 pointer-events-none')} />
      <div className="relative filter">{children}</div>
    </div>
  )
}

export default Glow
