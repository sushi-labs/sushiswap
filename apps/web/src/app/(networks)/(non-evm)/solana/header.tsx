'use client'

import { type ReactElement, Suspense } from 'react'
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
  const chainId = useSwapPageChainId() ?? ChainId.SOLANA
  return (
    <HeaderShell
      chainId={chainId}
      rightElement={
        <Suspense>
          <HeaderNetworkSelector
            networks={networks}
            selectedNetwork={chainId}
            className="flex"
          />
          <UserPortfolio selectedNetwork={chainId} />
        </Suspense>
      }
    />
  )
}
