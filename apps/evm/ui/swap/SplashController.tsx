import { SplashController as _SplashController } from '@sushiswap/ui/components/SplashController'
import { useAccount } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

import { useTokenState } from './token/TokenProvider'

export const SplashController: FC<{ show?: boolean; children: ReactNode }> = ({ show = false, children }) => {
  const { token0, token1, toChainId, fromChainId } = useTokenState()
  const { status } = useAccount()
  return (
    <_SplashController
      show={
        show || !token0 || !token1 || !toChainId || !fromChainId || status === 'connecting' || status === 'reconnecting'
      }
    >
      {children}
    </_SplashController>
  )
}
