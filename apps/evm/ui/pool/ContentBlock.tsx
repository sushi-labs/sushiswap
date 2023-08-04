import { classNames } from '@sushiswap/ui'
import React, { FC, ReactNode } from 'react'

export const ContentBlock: FC<{ title: ReactNode; children: ReactNode; disabled?: boolean; subtitle: ReactNode }> = ({
  title,
  children,
  disabled = false,
  subtitle,
}) => {
  return (
    <div className={classNames(disabled ? 'opacity-40 pointer-events-none' : '', 'flex flex-col gap-3')}>
      <div className="prose dark:prose-dark">
        <h4>{title}</h4>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}
