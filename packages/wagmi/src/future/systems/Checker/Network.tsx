'use client'

import { chainName } from 'sushi/chain'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import dynamic from 'next/dynamic'
import React, { FC, ReactElement } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkProps extends ButtonProps {
  chainId: number | undefined
}

const Component: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  ...rest
}): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId) return null

  const _chainId = Number(chainId)
  if (chain?.id !== _chainId)
    return (
      <Button
        fullWidth={fullWidth}
        size={size}
        onClick={() => switchNetwork?.(_chainId)}
        {...rest}
      >
        Switch to {chainName[_chainId]}
      </Button>
    )

  return <>{children}</>
}

const Network = dynamic(() => Promise.resolve(Component), { ssr: false })

export { Network, type NetworkProps }
