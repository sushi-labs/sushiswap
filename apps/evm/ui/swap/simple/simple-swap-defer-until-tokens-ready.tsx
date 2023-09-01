import SimpleSwapLoading from 'app/swap/(simple)/loading'
import { FC, ReactNode } from 'react'

import { useDerivedStateSimpleSwap } from './derivedstate-simple-swap-provider'

export const SimpleSwapDeferUntilTokensReady: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useDerivedStateSimpleSwap()

  if (isLoading) {
    return <SimpleSwapLoading />
  }

  return <>{children}</>
}
