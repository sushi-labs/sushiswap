import { getConnections } from 'src/lib/wallet/provider/store'
import type { WalletNamespace } from 'src/lib/wallet/types'
import { PRIVY_SVM_CONNECTOR_ID } from '../namespaces/svm/config'
import { PRIVY_EVM_CONNECTOR_ID } from './privy-evm-connector'

const PRIVY_EVM_WALLET_ID = `evm:${PRIVY_EVM_CONNECTOR_ID}`
const PRIVY_SVM_WALLET_ID = `svm:${PRIVY_SVM_CONNECTOR_ID.toLowerCase()}`

/** Whether a registered wallet connection is backed by the Privy session. */
export function isPrivyWalletConnectionId(connectionId: string): boolean {
  const id = connectionId.toLowerCase()
  return (
    id === PRIVY_EVM_WALLET_ID ||
    // Connections persisted by earlier releases are address-scoped.
    id.startsWith(`${PRIVY_EVM_WALLET_ID}.`) ||
    id === PRIVY_SVM_WALLET_ID
  )
}

/**
 * Whether another namespace still holds a Privy-backed connection.
 *
 * Privy is a single authenticated session shared by every namespace, so
 * logging out disconnects all of them. Disconnecting one wallet must therefore
 * only log out once it is the last one using that session.
 *
 * Reads the registered connections rather than the namespace's own provider
 * state: a namespace only clears its own entries, so a cross-namespace read is
 * unaffected by the disconnect in progress.
 */
export function hasPrivyWalletConnectionOutside(
  namespace: WalletNamespace,
): boolean {
  return getConnections().some(
    (connection) =>
      connection.namespace !== namespace &&
      isPrivyWalletConnectionId(connection.id),
  )
}
