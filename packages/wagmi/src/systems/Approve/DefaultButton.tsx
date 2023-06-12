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
        'hidden sm:flex mb-4 mt-2 mx-3 flex flex-col gap-1 w-6 h-6 disabled:pointer-events-none disabled:saturate-[0] cursor-pointer'
      )}
    >
      {children}
    </div>
  )
}
