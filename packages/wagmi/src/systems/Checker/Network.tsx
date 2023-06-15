import { chainName } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui'
import { FC, ReactElement } from 'react'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { CheckerButton } from './types'

export interface NetworkProps extends CheckerButton {
  chainId: number | undefined
}

export const Network: FC<NetworkProps> = ({ chainId, children, ...rest }): ReactElement<any, any> | null => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  if (!chainId) return null

  if (chain?.id !== chainId)
    return (
      <Button onClick={() => switchNetwork && switchNetwork(chainId)} {...rest}>
        Switch to {chainName[chainId]}
      </Button>
    )

  return <>{children}</>
}
