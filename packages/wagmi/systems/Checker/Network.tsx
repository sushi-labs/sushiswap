import { Chain, ChainId } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui'
import { FC } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: ChainId
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }) => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (chain?.id !== chainId)
    return (
      <Button onClick={() => switchNetwork && switchNetwork(chainId)} {...rest}>
        Switch to {Chain.from(chainId).name}
      </Button>
    )

  return <>{children}</>
}
