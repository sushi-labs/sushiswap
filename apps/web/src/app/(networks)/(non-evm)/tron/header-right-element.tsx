'use client'

import { Navigation, SushiNavigationDropdown, classNames } from '@sushiswap/ui'
import { SushiIcon } from '@sushiswap/ui/icons/SushiIcon'
import { SushiWithTextIcon } from '@sushiswap/ui/icons/SushiWithTextIcon'
import React, { type FC, Suspense } from 'react'
import { headerElements } from 'src/app/_common/header-elements'
import { SUPPORTED_NETWORKS } from 'src/config'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { WalletConnector } from './_common/ui/WalletConnector/wallet-connector'

export function HeaderRightElement({
  supportedNetworks,
}: { supportedNetworks?: readonly ChainId[] }) {
  return (
    <>
      <HeaderNetworkSelector
        networks={SUPPORTED_NETWORKS}
        supportedNetworks={supportedNetworks}
        selectedNetwork={ChainId.TRON}
        className="flex"
      />
      <WalletConnector variant="secondary" />
    </>
  )
}
