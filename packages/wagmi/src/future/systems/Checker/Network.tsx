import { chainName } from '@sushiswap/chain'
import { Button, ButtonProps } from '@sushiswap/ui/components/button'
import React, { FC, ReactElement } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

interface NetworkProps extends ButtonProps {
  chainId: number | undefined
}

const Network: FC<NetworkProps> = ({
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

export { Network, type NetworkProps }
