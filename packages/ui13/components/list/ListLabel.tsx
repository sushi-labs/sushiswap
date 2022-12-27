import React, { FC } from 'react'

export interface ListLabelProps {
  children: string
}

export const ListLabel: FC<ListLabelProps> = ({ children }) => {
  return <span className="text-xs font-medium text-gray-500 dark:text-slate-500">{children}</span>
}
