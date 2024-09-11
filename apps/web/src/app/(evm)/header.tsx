'use client'

import { ChevronDownIcon } from '@heroicons/react-v1/solid'
import {
  Badge,
  Navigation,
  SidebarToggle,
  classNames,
  useSidebar,
} from '@sushiswap/ui'
import { NetworkIcon } from '@sushiswap/ui/icons/NetworkIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { FC } from 'react'
import { UserPortfolio } from 'src/lib/wagmi/components/user-portfolio'
import { useAccount, useChainId } from 'wagmi'
import { headerElements } from './_common/header-elements'

export const Header: FC = () => {
  const chainId = useChainId()
  const { address } = useAccount()

  const { isOpen } = useSidebar()

  return (
    <div className="flex justify-between z-20">
      <div
        className={classNames(
          'hidden lg:flex justify-between items-center px-3 w-56 h-14 flex-shrink-0 bg-gray-100 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800',
          !isOpen && 'border-b',
        )}
      >
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
        leftElements={headerElements(chainId)}
        rightElement={<UserPortfolio />}
      />
    </div>
  )
}
