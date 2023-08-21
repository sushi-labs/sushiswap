import CrossChainSwapLoading from 'app/swap/cross-chain/loading'
import { FC, ReactNode } from 'react'

import { useDerivedStateCrossChainSwap } from './derivedstate-cross-chain-swap-provider'

export const CrossChainSwapDeferUntilTokensReady: FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoading } = useDerivedStateCrossChainSwap()

  if (isLoading) {
    return <CrossChainSwapLoading />
  }

  return <>{children}</>
}
