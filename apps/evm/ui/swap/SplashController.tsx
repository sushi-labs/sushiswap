import { SplashController as _SplashController } from '@sushiswap/ui/components/SplashController'
import { useAccount } from '@sushiswap/wagmi'
import { FC, ReactNode } from 'react'

export const SplashController: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useAccount()
  return <_SplashController show={status === 'connecting' || status === 'reconnecting'}>{children}</_SplashController>
}
