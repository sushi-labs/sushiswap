import { classNames } from '@sushiswap/ui'
import React, { FC } from 'react'

export interface DefaultButtonInterface {
  className?: string
  children: React.ReactNode
}

export const DefaultButton: FC<DefaultButtonInterface> = ({ className, children }) => {
  return (
    <div
      className={classNames(
        className,
        'mb-4 flex flex-col gap-1 w-6 h-6 m-1 disabled:pointer-events-none disabled:saturate-[0] cursor-pointer hover:scale-[1.25] transition-all'
      )}
    >
      {children}
    </div>
  )
}
