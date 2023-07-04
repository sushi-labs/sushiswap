import { chainName } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui/components/button'
import { ButtonProps } from '@sushiswap/ui/components/button'
import dynamic from 'next/dynamic'
import React, { FC, ReactElement } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

export interface NetworkProps extends ButtonProps {
  chainId: number | undefined
}

export const Component: FC<NetworkProps> = ({
  chainId,
  fullWidth = true,
  size = 'xl',
  children,
  ...rest
}): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId) return null

  if (chain?.id !== chainId)
    return (
      <Button fullWidth={fullWidth} size={size} onClick={() => switchNetwork?.(chainId)} {...rest}>
        Switch to {chainName[chainId]}
      </Button>
    )

  return <>{children}</>
}

// Temp solution until app dir
export const Network = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
