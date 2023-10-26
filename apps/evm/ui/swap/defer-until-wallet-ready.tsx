'use client'

import { useInterval } from '@sushiswap/hooks'
import { useAccount } from '@sushiswap/wagmi'
import { Splash } from '@sushiswap/ui'
import { FC, ReactNode, useState } from 'react'

export const DeferUntilWalletReady: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { status } = useAccount()
  const [show, setShow] = useState(false)

  // Resolve after 2 seconds to avoid showing the loading screen for too long
  useInterval(
    () => {
      setShow(true)
    },
    show ? null : 2000,
  )

  if (show) return <>{children}</>

  if (status === 'connecting' || status === 'reconnecting') {
    return <Splash />
  }

  return <>{children}</>
}
