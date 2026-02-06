'use client'

import type { ReactNode } from 'react'

export function DialogBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(80vh-176px)]">
      {children}
    </div>
  )
}
