import Loading from 'app/swap/loading'
import { FC, ReactNode } from 'react'

import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapDeferUntilTokensReady: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useDerivedStateCrossChainSwap()

  if (isLoading) {
    return <Loading />
  }

  return <>{children}</>
}
