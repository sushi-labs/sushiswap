import React, { FC, ReactNode } from 'react'
import { classNames } from '@sushiswap/ui'

export const ContentBlock: FC<{ title: ReactNode; children: ReactNode; disabled?: boolean }> = ({
  title,
  children,
  disabled = false,
}) => {
  return (
    <div className={classNames(disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-6')}>
      <h1 className="text-gray-500 dark:text-slate-400 text-slate-600 text-xl font-medium">{title}</h1>
      {children}
    </div>
  )
}
