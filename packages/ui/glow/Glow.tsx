import React, { FC } from 'react'
import { classNames } from '../lib/classNames'

const Glow: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className={classNames(className, 'relative w-full')}>
      <div className={classNames('from-pink/5 to-blue/5 fixed inset-0 bg-gradient-radial z-0 pointer-events-none')} />
      <div className="relative filter z-10">{children}</div>
    </div>
  )
}

export default Glow
