'use client'

import { LinkInternal, Navigation, classNames } from '@sushiswap/ui'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/sushi-with-text-icon'
import type { FC } from 'react'
import { WagmiHeaderComponents } from 'src/lib/wagmi/components/wagmi-header-components'
import type { ChainId } from 'sushi'
import { useChainId } from 'wagmi'
import { launchpadHeaderElements } from './header-elements'

interface LaunchpadHeaderProps {
  chainId: ChainId
  chainKey: string
  networks: readonly ChainId[]
}

export const LaunchpadHeader: FC<LaunchpadHeaderProps> = ({
  chainId: routeChainId,
  chainKey,
  networks,
}) => {
  const connectedChainId = useChainId()
  const chainId = routeChainId ?? connectedChainId

  return (
    <div className="z-20 h-[56px] w-full">
      <div className="fixed z-20 flex w-full">
        <div
          className={classNames(
            'hidden h-14 shrink-0 items-center justify-between px-1 lg:flex',
            '!bg-perps-background',
          )}
        >
          <LinkInternal
            className="!px-2"
            href={`/${chainKey}/swap`}
            aria-label="Return to Sushi Swap"
          >
            <SushiWithTextIcon width={90} />
          </LinkInternal>
        </div>
        <Navigation
          className="!z-[unset] !border-0 !bg-perps-background !pl-0 lg:!pl-0"
          hideSushiDropdown
          leftElements={launchpadHeaderElements(chainKey)}
          rightElement={
            <WagmiHeaderComponents
              networks={networks}
              selectedNetwork={chainId}
              hideNetworkSelector
              isPerps
            />
          }
        />
      </div>
    </div>
  )
}
