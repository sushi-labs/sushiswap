import React, { FC } from 'react'

export interface ListLabelProps {
  children: string
}

export const ListLabel: FC<ListLabelProps> = ({ children }) => {
  return <span className="text-sm font-medium text-gray-600 dark:text-slate-400">{children}</span>
}
