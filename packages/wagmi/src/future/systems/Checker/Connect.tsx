'use client'

import { ButtonProps } from '@sushiswap/ui/components/button'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import { useAccount } from 'wagmi'

import { ConnectButton } from '../../components'

const Component: FC<ButtonProps> = ({ children, fullWidth = true, size = 'xl', ...props }) => {
  const { address } = useAccount()

  if (!address)
    return (
      <ConnectButton fullWidth={fullWidth} size={size} {...props}>
        Connect Wallet
      </ConnectButton>
    )

  return <>{children}</>
}

const Connect = dynamic(() => Promise.resolve(Component), { ssr: false })

export { Connect }
