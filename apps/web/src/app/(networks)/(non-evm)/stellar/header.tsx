'use client'

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
      chainId={ChainId.STELLAR}
      includeOnramper
      position="static"
      rightElement={
        <>
          <HeaderNetworkSelector
            networks={networks}
            selectedNetwork={ChainId.STELLAR}
            className="flex"
          />
          <UserPortfolio
            namespace="stellar"
            selectedNetwork={ChainId.STELLAR}
          />
        </>
      }
    />
  )
}
