'use client'

import { useIsMounted, useLocalStorage } from '@sushiswap/hooks'
import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { type FC, Suspense } from 'react'
import { SUPPORTED_NETWORKS } from 'src/config'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { headerElements } from './_common/header-elements'
import { ChainIdOperatorBanner } from './_common/ui/Shared/chain-id-operator-banner'
import { WalletConnector } from './_common/ui/WalletConnector/WalletConnector'
// import { MobileMetamaskCompatibilityModal } from './_common/ui/mobile-metamask-compatibility-modal'

export const Header: FC<{ className?: string }> = ({ className }) => {
  const [hasClosedBanner] = useLocalStorage(
    'has-closed-kadena-chain-id-operator-banner',
    false,
  )
  const isMounted = useIsMounted()

  return (
    <div
      className={classNames(
        'z-20 w-full h-[56px]',
        !hasClosedBanner && isMounted ? 'mb-[56px]' : '',
        className,
      )}
    >
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
          leftElements={headerElements}
          rightElement={
            <Suspense>
              <HeaderNetworkSelector
                networks={SUPPORTED_NETWORKS}
                selectedNetwork={ChainId.KADENA}
                className="flex"
              />
              <WalletConnector variant="secondary" />
            </Suspense>
          }
        />
      </div>
      <ChainIdOperatorBanner className="top-[56px] fixed z-[19]" />
      {/* <MobileMetamaskCompatibilityModal /> */}
    </div>
  )
}
