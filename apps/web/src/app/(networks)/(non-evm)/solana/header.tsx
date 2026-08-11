'use client'

import { Suspense } from 'react'
import { HeaderShell } from 'src/app/(networks)/_ui/header-shell'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { UserPortfolio } from '../../_ui/user-portfolio'

export function Header({
  networks,
}: {
  networks?: readonly ChainId[]
}) {
  return (
    <HeaderShell
      chainId={ChainId.SOLANA}
      rightElement={
        <Suspense>
          <HeaderNetworkSelector
            networks={networks}
            selectedNetwork={ChainId.SOLANA}
            className="flex"
          />
          <UserPortfolio selectedNetwork={ChainId.SOLANA} />
        </Suspense>
      }
    />
  )
}
