'use client'

import { queryClient } from '@sushiswap/react-query'
import { QueryClientProvider as _QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

export const QueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <_QueryClientProvider client={queryClient}>{children}</_QueryClientProvider>
}
