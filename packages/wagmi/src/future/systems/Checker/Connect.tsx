'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { ButtonProps } from '@sushiswap/ui/components/button'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { ConnectButton } from '../../components'

const Connect: FC<ButtonProps> = ({
  children,
  fullWidth = true,
  size = 'xl',
  ...props
}) => {
  const isMounted = useIsMounted()
  const { address } = useAccount()

  if (isMounted && !address)
    return (
      <ConnectButton fullWidth={fullWidth} size={size} {...props}>
        Connect Wallet
      </ConnectButton>
    )

  return <>{children}</>
}

export { Connect }
