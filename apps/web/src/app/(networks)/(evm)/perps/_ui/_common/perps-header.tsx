'use client'

import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import type { FC } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import type { ChainId } from 'sushi'
import { useChainId } from 'wagmi'

interface HeaderProps {
  chainId?: ChainId
  networks?: readonly ChainId[]
}

export const PerpsHeader: FC<HeaderProps> = ({
  chainId: _chainId,
  networks,
}) => {
  const connectedChainId = useChainId()
  const chainId = _chainId ?? connectedChainId

  return (
    <div className="w-full h-[56px] z-20">
      <div className="fixed w-full flex z-20">
        <div
          className={classNames(
            'hidden lg:flex justify-between items-center px-1 h-14 flex-shrink-0 bg-[#0D1421] border-[#1E2939] border-b',
          )}
        >
          <SushiNavigationDropdown className="!px-2">
            <SushiWithTextIcon width={90} />
          </SushiNavigationDropdown>
        </div>
        <div className="flex lg:hidden justify-between items-center pl-4 bg-[#0D1421] border-[#1E2939] border-b">
          <SushiNavigationDropdown>
            <SushiIcon width={24} height={24} />
          </SushiNavigationDropdown>
        </div>
        <Navigation
          className="!pl-0 lg:!pl-4 !z-[unset] !bg-[#0D1421]"
          hideSushiDropdown
          // todo: perps-specific header elements - Home (go back to swap), Trade, Referrals, Vaults
          leftElements={headerElements({ chainId })}
          rightElement={
            <WagmiHeaderComponents
              networks={networks}
              selectedNetwork={chainId}
            />
          }
        />
      </div>
    </div>
  )
}
