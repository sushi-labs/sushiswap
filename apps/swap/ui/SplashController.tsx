import { FC, ReactNode } from 'react'
import { useTokenState } from './TokenProvider'
import { SplashController as UISplashController } from '@sushiswap/ui/future/components/SplashController'

export const SplashController: FC<{ children: ReactNode }> = ({ children }) => {
  const { token0, token1 } = useTokenState()
  return <UISplashController show={!token0 || !token1}>{children}</UISplashController>
}
