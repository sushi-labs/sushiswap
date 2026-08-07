'use client'

import { Suspense } from 'react'
import { HeaderShell } from 'src/app/(networks)/_ui/header-shell'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { UserProfile } from './_common/ui/user-profile/user-profile'

export function Header({
  networks,
}: {
  networks?: readonly ChainId[]
}) {
  return (
    <HeaderShell
      chainId={ChainId.APTOS}
      rightElement={
        <Suspense>
          <HeaderNetworkSelector
            networks={networks}
            selectedNetwork={ChainId.APTOS}
            className="flex"
          />
          <UserProfile />
        </Suspense>
      }
    />
  )
}
