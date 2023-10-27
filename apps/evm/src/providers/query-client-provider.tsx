import { createQueryClient } from '@sushiswap/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider as _QueryClientProvider } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'

const client = createQueryClient()

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <_QueryClientProvider client={client}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </_QueryClientProvider>
  )
}
