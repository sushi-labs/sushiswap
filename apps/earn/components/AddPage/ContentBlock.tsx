import React, { FC, ReactNode } from 'react'

export const ContentBlock: FC<{ title: ReactNode; children: ReactNode }> = ({ title, children }) => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-gray-500 dark:text-slate-400 text-xl font-medium max-w-[460px]">{title}</h1>
      {children}
    </div>
  )
}
