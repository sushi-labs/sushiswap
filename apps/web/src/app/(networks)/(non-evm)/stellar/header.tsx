'use client'

import type { ReactElement } from 'react'
import { HeaderShell } from 'src/app/(networks)/_ui/header-shell'
import { useSwapPageChainId } from 'src/app/(networks)/_ui/use-swap-page-chain-id'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { UserPortfolio } from '../../_ui/user-portfolio'

export function Header({
  networks,
}: {
  networks?: readonly ChainId[]
}): ReactElement {
  const chainId = useSwapPageChainId() ?? ChainId.STELLAR
  return (
    <HeaderShell
      chainId={chainId}
      includeOnramper
      position="static"
      rightElement={
        <>
          <HeaderNetworkSelector
            networks={networks}
            selectedNetwork={chainId}
            className="flex"
          />
          <UserPortfolio
            namespace={chainId === ChainId.STELLAR ? 'stellar' : undefined}
            selectedNetwork={chainId}
          />
        </>
      }
    />
  )
}
