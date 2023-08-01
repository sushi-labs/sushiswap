'use client'

import { useIsMounted } from '@sushiswap/hooks'
import { ButtonProps } from '@sushiswap/ui/components/button'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { ConnectButton } from '../../components'

export const Component: FC<ButtonProps> = ({ children, fullWidth = true, size = 'xl', ...props }) => {
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

export const Connect = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
