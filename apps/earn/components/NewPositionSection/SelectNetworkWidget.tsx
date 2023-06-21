import { ChainId, chainName } from '@sushiswap/chain'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import React, { FC, memo } from 'react'

import { V3_SUPPORTED_CHAIN_IDS } from '@sushiswap/v3-sdk'
import { NetworkSelector } from '@sushiswap/ui/future/components/networkselector'
import { Button } from '@sushiswap/ui/future/components/button'
import { ContentBlock } from '../AddPage/ContentBlock'
import { SelectPrimitive } from '@sushiswap/ui/future/components/select'
import { SelectIcon } from '@sushiswap/ui/future/components/select'

interface SelectNetworkWidgetProps {
  networks?: ChainId[]
  selectedNetwork: ChainId
  onSelect(chainId: ChainId): void
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(function SelectNetworkWidget({
  selectedNetwork,
  onSelect,
  networks,
}) {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">network</span> would you like to provide liquidity on?
        </>
      }
    >
      <div className="flex relative z-[100]">
        <NetworkSelector
          networks={networks ?? V3_SUPPORTED_CHAIN_IDS}
          selected={selectedNetwork}
          onSelect={onSelect}
          variant="menu"
        >
          <SelectPrimitive.Trigger>
            <Button variant="secondary" className="!font-medium">
              <NetworkIcon chainId={selectedNetwork} width={16} height={16} />
              {chainName?.[selectedNetwork]}
              <SelectIcon />
            </Button>
          </SelectPrimitive.Trigger>
        </NetworkSelector>
      </div>
    </ContentBlock>
  )
})
