'use client'

import { Navigation, SushiNavigationDropdown } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { type FC } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { useResolvedChainId } from 'src/lib/wagmi/hooks/wallet/use-resolved-chain-id'
import { ChainId } from 'sushi'
import { Header as _Header } from '~evm/[chainId]/header'

interface HeaderProps {
  chainId?: ChainId
  networks?: readonly ChainId[]
}

export const Header: FC<HeaderProps> = ({ chainId, networks }) => {
  return chainId === ChainId.KATANA ? (
    <TransparentHeader chainId={chainId} networks={networks} />
  ) : (
    <_Header chainId={chainId} networks={networks} />
  )
}

const TransparentHeader: FC<HeaderProps> = ({
  chainId: _chainId,
  networks,
}) => {
  const { chainId, isLoading: isNetworkLoading } = useResolvedChainId(_chainId)

  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <div className="hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 border-transparent border-b">
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div className="flex lg:hidden justify-between items-center pl-4 border-transparent border-b">
          <SushiNavigationDropdown>
            <SushiIcon width={24} height={24} />
          </SushiNavigationDropdown>
        </div>
        <Navigation
          className="!pl-0 lg:!pl-4 !z-[unset] !bg-[unset] dark:!bg-[unset] !border-transparent dark:!border-transparent"
          hideSushiDropdown
          leftElements={headerElements({ chainId })}
          rightElement={
            <WagmiHeaderComponents
              networks={networks}
              selectedNetwork={chainId}
              isNetworkLoading={isNetworkLoading}
            />
          }
        />
      </div>
    </div>
  )
}
