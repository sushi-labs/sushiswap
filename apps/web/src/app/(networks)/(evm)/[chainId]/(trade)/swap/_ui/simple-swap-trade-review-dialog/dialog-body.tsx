'use client'

import React, { type FC, type ReactNode } from 'react'

export const DialogBody: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)]">
    {children}
  </div>
)
