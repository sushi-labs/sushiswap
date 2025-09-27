'use client'

import { SUPPORTED_NETWORKS } from 'src/config'
import { HeaderNetworkSelector } from 'src/lib/wagmi/components/header-network-selector'
import { ChainId } from 'sushi'
import { UserProfile } from './_common/ui/user-profile/user-profile'

export function HeaderRightElement({
  supportedNetworks,
}: { supportedNetworks?: readonly ChainId[] }) {
  return (
    <>
      <HeaderNetworkSelector
        networks={SUPPORTED_NETWORKS}
        supportedNetworks={supportedNetworks}
        selectedNetwork={ChainId.APTOS}
        className="flex"
      />
      <UserProfile />
    </>
  )
}
