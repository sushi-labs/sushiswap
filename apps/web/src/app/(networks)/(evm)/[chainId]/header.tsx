'use client'

import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { type FC } from 'react'
import { type NonStandardChainId, SUPPORTED_NETWORKS } from 'src/config'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import { useDerivedStateSimpleTrade } from 'src/ui/swap/trade/derivedstate-simple-trade-provider'
import { ChainId, type EvmChainId } from 'sushi/chain'
import type { ChainId as ChainIdType } from 'sushi/chain'
import { useChainId } from 'wagmi'
import { headerElements } from '../_common/header-elements'

interface HeaderProps {
  chainId?: ChainIdType
  supportedNetworks?: readonly (EvmChainId | NonStandardChainId)[]
}

export const Header: FC<HeaderProps> = ({ chainId, supportedNetworks }) => {
  const { state } = useDerivedStateSimpleTrade()
  console.log('state', state)

  const tradeView = state?.tradeView

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
      <div className="flex fixed z-20 w-full">
        <div className="hidden flex-shrink-0 justify-between items-center px-1 h-14 border-b border-transparent lg:flex">
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div className="flex justify-between items-center pl-4 border-b border-transparent lg:hidden">
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
              selectedNetwork={chainId as EvmChainId}
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
      <div className="flex fixed z-20 w-full">
        <div
          className={classNames(
            'hidden flex-shrink-0 justify-between items-center px-1 h-14 bg-gray-100 border-b border-gray-200 lg:flex dark:bg-slate-900 dark:border-slate-800',
          )}
        >
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div className="flex justify-between items-center pl-4 bg-gray-100 border-b border-gray-200 lg:hidden dark:bg-slate-900 dark:border-slate-800">
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
              selectedNetwork={chainId as EvmChainId}
              supportedNetworks={supportedNetworks}
            />
          }
        />
      </div>
    </div>
  )
}
