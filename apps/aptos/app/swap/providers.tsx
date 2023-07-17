'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SwapProvider } from './trade/TradeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  return (
    <SwapProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SwapProvider>
  )
}
