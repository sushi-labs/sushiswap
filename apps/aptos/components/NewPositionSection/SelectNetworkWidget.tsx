import React, { FC, memo } from 'react'
import { ContentBlock } from '../ContentBlock'
import { NetworkSelector } from '@sushiswap/ui/future/components/networkselector'
import { Popover } from '@headlessui/react'
import { Button } from '@sushiswap/ui/future/components/button'
import { classNames } from '@sushiswap/ui'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Token } from 'utils/tokenType'

interface SelectNetworkWidgetProps {}

export const SelectNetworkWidget: FC<SelectNetworkWidgetProps> = memo(function SelectNetworkWidget({}) {
  return (
    <ContentBlock
      title={
        <>
          Which <span className="text-gray-900 dark:text-white">network</span> would you like to provide liquidity on?
        </>
      }
    >
      <div className="flex relative z-[100]">
        {/* <NetworkSelector>
          {({ open }) => (
            <Popover.Button as={Button} variant="outlined" color="default" size="xl" className="!font-medium">
              <img
                src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
                className="rounded-full"
                height={20}
                width={20}
                alt=""
              />
              APTOS
              <ChevronDownIcon
                width={24}
                height={24}
                className={classNames('transition-all', open ? 'rotate-180' : 'rotate-0', 'hidden sm:block')}
              />
            </Popover.Button>
          )}
        </NetworkSelector> */}

        <NetworkSelector>
          <Popover as={Button} color="default" size="xl" className="!font-medium">
            <img
              src="https://cryptototem.com/wp-content/uploads/2022/08/aptos-logo.jpg"
              alt=""
              className="rounded-full"
              height={20}
              width={20}
            />
            APTOS
          </Popover>
        </NetworkSelector>
      </div>
    </ContentBlock>
  )
})
