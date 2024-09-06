'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import { Badge, Navigation, SidebarToggle } from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { FC } from 'react'
import { UserPortfolio } from 'src/lib/wagmi/components/user-portfolio'
import { useAccount, useChainId } from 'wagmi'
import { headerElements } from './_common/header-elements'

export const Header: FC = () => {
  const chainId = useChainId()
  const { address } = useAccount()

  return (
    <div className="flex justify-between gap-4 fixed top-6 left-6 right-6 z-20">
      <div className="px-3 flex justify-between items-center w-56 h-14 flex-shrink-0 bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl">
        <SushiWithTextIcon width={90} />
        <SidebarToggle variant="ghost" asChild>
          <Badge
            position="bottom-right"
            badgeContent={
              address ? (
                <div className="bg-green rounded-full w-2 h-2 mr-0.5 mb-0.5" />
              ) : (
                <div />
              )
            }
          >
            <NetworkIcon chainId={chainId} width={22} height={22} />
          </Badge>
          <ChevronDownIcon className="w-3 h-3" />
        </SidebarToggle>
      </div>
      <Navigation
        className="static bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl"
        variant="transparent"
        leftElements={headerElements(chainId)}
        rightElement={<UserPortfolio />}
      />
    </div>
  )
}
