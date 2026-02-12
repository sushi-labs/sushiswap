'use client'

import type { ButtonProps } from '@sushiswap/ui'
import type { FC } from 'react'
import { ConnectButton } from 'src/lib/wagmi/components/connect-button'
import { useAccount } from 'src/lib/wallet'

const Connect: FC<ButtonProps> = ({ children, ...props }) => {
  const account = useAccount('stellar')

  if (!account) return <ConnectButton namespace="stellar" {...props} />

  return <>{children}</>
}

export { Connect }
