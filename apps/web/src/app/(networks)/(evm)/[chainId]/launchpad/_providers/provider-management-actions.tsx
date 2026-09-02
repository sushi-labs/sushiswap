import type { LaunchpadToken } from '@sushiswap/graph-client/data-api'
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
) {
  switch (props.token.__typename) {
    case 'SushiV2LaunchpadToken':
      return <SushiV2ManagementActions {...props} token={props.token} />
    case 'SushiV1LaunchpadToken':
    case 'PoolsFunV1LaunchpadToken':
      return null
  }
}
