'use client'

import {
  type ConnectorClient,
  type WalletConnectorId,
  createConnectorId,
} from '@solana/connector'
import { useEffect } from 'react'
import { getConnectorConfig } from 'src/app/(networks)/(non-evm)/solana/_common/config/connector'
import { shouldReconnectPrivySvm } from 'src/lib/wallet/privy-storage'
import { waitForValue } from 'src/lib/wallet/privy/wait-for-value'
import { PRIVY_SVM_CONNECTOR_ID } from '../config'

const attemptedClients = new WeakSet<ConnectorClient>()

export function useSvmSilentReconnect(client: ConnectorClient | null): void {
  useEffect(() => {
    if (!client || attemptedClients.has(client)) return

    const storage = getConnectorConfig().storage?.wallet
    const walletName = storage?.get()
    if (
      typeof walletName !== 'string' ||
      !walletName ||
      shouldReconnectPrivySvm() ||
      createConnectorId(walletName) === PRIVY_SVM_CONNECTOR_ID ||
      client.getSnapshot().wallet.status !== 'disconnected'
    ) {
      return
    }

    const controller = new AbortController()
    void waitForValue<WalletConnectorId | undefined>({
      getValue: () =>
        client.getSnapshot().connectors.find(({ name }) => name === walletName)
          ?.id,
      predicate: Boolean,
      subscribe: (listener) => client.subscribe(listener),
      signal: controller.signal,
      timeoutMs: 5_000,
      timeoutMessage: 'Saved Solana wallet was not detected',
    })
      .then(async (connectorId) => {
        if (
          !connectorId ||
          controller.signal.aborted ||
          attemptedClients.has(client) ||
          shouldReconnectPrivySvm() ||
          storage?.get() !== walletName ||
          client.getSnapshot().wallet.status !== 'disconnected'
        ) {
          return
        }

        attemptedClients.add(client)
        await client.connectWallet(connectorId, {
          silent: true,
          allowInteractiveFallback: false,
        })
      })
      .catch(() => {
        // Locked, revoked, or missing wallets wait for an explicit Connect.
        // Keep the saved preference; disconnect() would clear it.
      })

    return () => controller.abort()
  }, [client])
}
