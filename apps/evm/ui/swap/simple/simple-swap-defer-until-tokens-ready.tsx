import Loading from 'app/swap/loading'
import { FC, ReactNode } from 'react'

import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapDeferUntilTokensReady: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useDerivedStateSimpleSwap()

  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
