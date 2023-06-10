import { queryClient } from '@sushiswap/react-query'
import { FC, ReactNode } from 'react'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider as _QueryClientProvider } from '@tanstack/react-query'

export const QueryClientProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <_QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </_QueryClientProvider>
  )
}
