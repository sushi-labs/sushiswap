import { ChainId } from '@sushiswap/chain'
import { CHAIN_NAME } from '@sushiswap/graph-config'
import { NetworkSelector } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import React, { FC } from 'react'

import { SUPPORTED_CHAINS } from '../config'

interface NetworkModal {
  chainId: ChainId
  setChainId: (chainId: ChainId) => void
}

export const NetworkModal: FC<NetworkModal> = ({ chainId, setChainId }) => {
  return (
    <NetworkSelector networks={SUPPORTED_CHAINS} selected={chainId} onSelect={setChainId}>
      <Button variant="secondary">
        <NetworkIcon type="circle" chainId={chainId} width={28} height={28} />
        <span>{CHAIN_NAME[chainId]}</span>
      </Button>
    </NetworkSelector>
  )
}
