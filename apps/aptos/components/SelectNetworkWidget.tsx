import React, { FC, memo } from 'react'
import { ContentBlock } from './ContentBlock'
import { NetworkSelector } from '@sushiswap/ui/future/components/networkselector'
import { Popover } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { NetworkIcon, classNames } from '@sushiswap/ui'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { ChainId, chainName } from '@sushiswap/chain'

interface SelectNetworkWidgetProps {
  // networks?: ChainId[]
  // selectedNetwork: ChainId
  // onSelect(chainId: ChainId): void
}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(function SelectNetworkWidget(
  {
    // selectedNetwork,
    // onSelect,
    // networks,
  }
) {
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
        // networks={networks ?? SUSHISWAP_V3_SUPPORTED_CHAIN_IDS}
        // selected={selectedNetwork}
        // onSelect={onSelect}
        // variant="menu"
        // align="left"
        >
          {({ open }) => (
            <Popover.Button as={Button} variant="outlined" color="default" size="xl" className="!font-medium">
              APTOS
              {/* <NetworkIcon width={20} height={20}></NetworkIcon> */}
              <ChevronDownIcon
                width={24}
                height={24}
                className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
              />
            </Popover.Button>
          )}
        </NetworkSelector>
      </div>
    </ContentBlock>
  )
})
