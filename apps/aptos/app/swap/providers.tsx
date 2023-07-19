'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SwapProvider } from './trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <SwapProvider>{children}</SwapProvider>
    </QueryClientProvider>
  )
}
