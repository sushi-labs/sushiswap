import React, { FC, ReactNode } from 'react'

export interface ListKeyValueProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export const ListKeyValue: FC<ListKeyValueProps> = ({ title, subtitle, children }) => {
  return (
    <div className="grid grid-cols-2 gap-2 py-3 px-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{title}</span>
        {subtitle && <span className="text-xs text-gray-500 dark:text-slate-500">{subtitle}</span>}
      </div>
      <div className="flex justify-end">
        <span className="text-sm font-medium text-gray-900 dark:text-slate-50">{children}</span>
      </div>
    </div>
  )
}
