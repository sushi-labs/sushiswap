import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
import type { ReactElement } from 'react'
import type { EvmAddress } from 'sushi/evm'
import type { SushiV2FeeDisposition } from './sushi-v2/contract'
import { SushiV2ManagementActions } from './sushi-v2/management-actions'

interface ProviderManagementActionsProps {
  token: LaunchpadToken
  connectedAddress: EvmAddress | undefined
  isLaunchpadOwner: boolean
  newCreator: string
  newFeeReceiver: string
  isUpdating: boolean
  error: string | null
  onNewCreatorChange: (address: string) => void
  onNewFeeReceiverChange: (address: string) => void
  onTransferCreator: () => void
  onSetFeeReceiver: () => void
  onSetFeeDisposition: (next: SushiV2FeeDisposition) => void
}

export function ProviderManagementActions(
  props: ProviderManagementActionsProps,
): ReactElement | null {
  switch (props.token.__typename) {
    case 'SushiV2LaunchpadToken':
      return <SushiV2ManagementActions {...props} token={props.token} />
    case 'SushiV1LaunchpadToken':
    case 'PoolsFunV1LaunchpadToken':
    case 'PoolsFunV2LaunchpadToken':
    case 'PoolsFunV3LaunchpadToken':
      return null
  }
}
