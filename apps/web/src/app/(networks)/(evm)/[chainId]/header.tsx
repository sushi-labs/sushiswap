'use client'

import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { type FC } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import { SUPPORTED_NETWORKS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { ChainId } from 'sushi'

import { useChainId } from 'wagmi'
import { useDerivedStateSimpleTrade } from './[trade]/_ui/swap/trade/derivedstate-simple-trade-provider'

interface HeaderProps {
  chainId?: ChainId
  supportedNetworks?: readonly ChainId[]
}

export const Header: FC<HeaderProps> = ({ chainId, supportedNetworks }) => {
  const {
    state: { tradeView },
  } = useDerivedStateSimpleTrade()
  return chainId === ChainId.KATANA && tradeView === 'simple' ? (
    <TransparentHeader
      chainId={chainId}
      supportedNetworks={supportedNetworks}
    />
  ) : (
    <_Header chainId={chainId} supportedNetworks={supportedNetworks} />
  )
}

const TransparentHeader: FC<HeaderProps> = ({
  chainId: _chainId,
  supportedNetworks,
}) => {
  const connectedChainId = useChainId()
  const chainId = _chainId ?? connectedChainId

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
              networks={SUPPORTED_NETWORKS}
              selectedNetwork={chainId}
              supportedNetworks={supportedNetworks}
            />
          }
        />
      </div>
    </div>
  )
}

const _Header: FC<HeaderProps> = ({ chainId: _chainId, supportedNetworks }) => {
  const connectedChainId = useChainId()
  const chainId = _chainId ?? connectedChainId

  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <div
          className={classNames(
            'hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-800 border-b',
          )}
        >
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div className="flex lg:hidden justify-between items-center pl-4 bg-gray-100 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <SushiNavigationDropdown>
            <SushiIcon width={24} height={24} />
          </SushiNavigationDropdown>
        </div>
        <Navigation
          className="!pl-0 lg:!pl-4 !z-[unset]"
          hideSushiDropdown
          leftElements={headerElements({ chainId })}
          rightElement={
            <WagmiHeaderComponents
              networks={SUPPORTED_NETWORKS}
              selectedNetwork={chainId}
              supportedNetworks={supportedNetworks}
            />
          }
        />
      </div>
    </div>
  )
}
