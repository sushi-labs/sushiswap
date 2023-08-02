import { classNames, typographyVariants } from '@sushiswap/ui'
import React, { FC, ReactNode } from 'react'

export const ContentBlock: FC<{ title: ReactNode; children: ReactNode; disabled?: boolean }> = ({
  title,
  children,
  disabled = false,
}) => {
  return (
    <div className={classNames(disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-3')}>
      <h1 className={typographyVariants({ variant: 'p' })}>{title}</h1>
      {children}
    </div>
  )
}
