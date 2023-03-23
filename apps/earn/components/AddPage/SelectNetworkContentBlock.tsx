import { ContentBlock } from './ContentBlock'
import { NetworkSelector } from '@sushiswap/ui/future/components/networkselector'
import { SUPPORTED_CHAIN_IDS } from '../../config'
import { Popover } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { NetworkIcon } from '@sushiswap/ui/future/components/icons'
import { Chain } from '@sushiswap/chain'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { classNames } from '@sushiswap/ui'
import React from 'react'
import { useAddPositionActions, useAddPositionState } from './AddPositionProvider'

export const SelectNetworkContentBlock = () => {
  const { chainId } = useAddPositionState()
  const { setChainId } = useAddPositionActions()

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
          networks={SUPPORTED_CHAIN_IDS}
          selected={chainId}
          onSelect={setChainId}
          variant="menu"
          align="left"
        >
          {({ open }) => (
            <Popover.Button as={Button} size="xl" variant="outlined" color="default">
              <NetworkIcon chainId={chainId} width={28} height={28} />
              <div className="hidden xl:block">
                {Chain.from(chainId).name?.replace('Mainnet Shard 0', '')?.replace('Mainnet', '')?.trim()}
              </div>
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
}
