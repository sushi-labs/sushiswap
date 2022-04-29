import React from 'react'
import classNames from 'classnames'

type Props = {
  children?: React.ReactNode
  className?: string
}

function Glow({ children, className }: Props): JSX.Element {
  return (
    <div className={classNames(className, 'relative w-full')}>
      <div className={classNames('from-pink/5 to-blue/5 fixed inset-0 bg-gradient-radial z-0 pointer-events-none')} />
      <div className="relative z-10 filter">{children}</div>
    </div>
  )
}

export default Glow
