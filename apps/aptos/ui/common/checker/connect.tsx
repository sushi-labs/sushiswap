'use client'

import { ButtonProps } from '@sushiswap/ui/components/button'
import { FC } from 'react'

import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { ConnectButton } from 'ui/common/user-profile/connect-button'

const Connect: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const { connected } = useWallet()

  if (!connected)
    return (
      <ConnectButton fullWidth={fullWidth} size={size} {...props}>
        Connect Wallet
      </ConnectButton>
    )

  return <>{children}</>
}

export { Connect }
