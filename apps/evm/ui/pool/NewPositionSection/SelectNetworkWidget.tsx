import { ChainId, chainName } from '@sushiswap/chain'
import { Button } from '@sushiswap/ui/components/button'
import { NetworkIcon } from '@sushiswap/ui/components/icons'
import { NetworkSelector } from '@sushiswap/ui/components/networkselector'
import { SelectIcon } from '@sushiswap/ui/components/select'
import { SUSHISWAP_V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import React, { FC, memo } from 'react'

import { ContentBlock } from '../AddPage/ContentBlock'

interface SelectNetworkWidgetProps {
  networks?: ChainId[]
  selectedNetwork: ChainId
  onSelect(chainId: ChainId): void
  title?: string
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(function SelectNetworkWidget({
  selectedNetwork,
  onSelect,
  networks,
  title,
}) {
  return (
    <ContentBlock
      title={
        title ?? (
          <>
            Which <span className="text-gray-900 dark:text-white">network</span> would you like to provide liquidity on?
          </>
        )
      }
    >
      <div className="flex relative z-[100]">
        <NetworkSelector
          networks={networks ?? SUSHISWAP_V3_SUPPORTED_CHAIN_IDS}
          selected={selectedNetwork}
          onSelect={onSelect}
          variant="menu"
        >
          <Button variant="secondary" className="!font-medium">
            <NetworkIcon chainId={selectedNetwork} width={16} height={16} />
            {chainName?.[selectedNetwork]}
            <SelectIcon />
          </Button>
        </NetworkSelector>
      </div>
    </ContentBlock>
  )
})
