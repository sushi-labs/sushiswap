'use client'

import { usePrivy, useWallets } from '@privy-io/react-auth'
import {
  type Config,
  type Connector,
  type CreateConnectorFn,
  getConnection,
  getConnectors,
  reconnect,
} from '@wagmi/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type PersistedWagmiState,
  usePersistedWagmiState,
} from 'src/lib/wagmi/components/wagmi-persisted-state-provider'
import { getWagmiConfig } from 'src/lib/wagmi/config'
import { useMarkWalletNamespaceRestored } from 'src/lib/wallet/provider'
import { useConnectors } from 'wagmi'
import { EvmAdapterConfig, getEvmAdapterIdForConnector } from '../config'

const PRIVY_RESTORATION_TIMEOUT_MS = 10_000

type RestorationTarget =
  | { type: 'none' }
  | { type: 'privy'; connectorId: string }
  | {
      type: 'external'
      connectorId: string
      connectorType: string
    }

export function useRestoreEvmConnection(): void {
  const persistedState = usePersistedWagmiState()
  const connectors = useConnectors()
  const { ready: arePrivyWalletsReady, wallets: privyWallets } = useWallets()
  const { error: privyError } = usePrivy()
  const markNamespaceRestored = useMarkWalletNamespaceRestored()
  const [restorationTarget] = useState<RestorationTarget>(() =>
    getRestorationTarget(persistedState),
  )
  const [isRestored, setIsRestored] = useState(false)
  const restorationPromiseRef = useRef<Promise<void> | null>(null)

  const markRestored = useCallback(() => setIsRestored(true), [])

  useEffect(() => {
    if (restorationTarget.type === 'none') markRestored()
  }, [markRestored, restorationTarget.type])

  useEffect(() => {
    if (restorationTarget.type !== 'external') return

    restorationPromiseRef.current ??=
      restoreExternalConnection(restorationTarget)
    let active = true

    restorationPromiseRef.current.finally(() => {
      if (active) markRestored()
    })

    return () => {
      active = false
    }
  }, [markRestored, restorationTarget])

  useEffect(() => {
    if (restorationTarget.type !== 'privy' || isRestored) return

    if (privyError) {
      console.warn('Privy initialization failed during EVM restoration', {
        error: privyError,
      })
      markRestored()
      return
    }

    if (!arePrivyWalletsReady) return

    const hasPersistedWallet = privyWallets.some((wallet) => {
      const connectorId =
        wallet.walletClientType === 'privy'
          ? `${wallet.meta.id}.${wallet.address}`
          : wallet.meta.id

      return connectorId === restorationTarget.connectorId
    })

    if (!hasPersistedWallet) {
      markRestored()
      return
    }

    const connector = connectors.find(
      (connector) => connector.id === restorationTarget.connectorId,
    )
    if (!connector) return

    restorationPromiseRef.current ??= restorePrivyConnection(connector)
    let active = true

    restorationPromiseRef.current.finally(() => {
      if (active) markRestored()
    })

    return () => {
      active = false
    }
  }, [
    arePrivyWalletsReady,
    connectors,
    isRestored,
    markRestored,
    privyError,
    privyWallets,
    restorationTarget,
  ])

  useEffect(() => {
    if (restorationTarget.type !== 'privy' || isRestored) return

    const timeout = window.setTimeout(() => {
      console.warn('Privy EVM wallet restoration timed out')
      markRestored()
    }, PRIVY_RESTORATION_TIMEOUT_MS)

    return () => window.clearTimeout(timeout)
  }, [isRestored, markRestored, restorationTarget.type])

  useEffect(() => {
    if (isRestored) markNamespaceRestored('evm')
  }, [isRestored, markNamespaceRestored])
}

function getRestorationTarget(state: PersistedWagmiState): RestorationTarget {
  const connection = state?.current
    ? state.connections.get(state.current)
    : undefined

  if (!connection) return { type: 'none' }

  const connectorId = connection.connector.id
  return isPrivyConnectorId(connectorId)
    ? { type: 'privy', connectorId }
    : {
        type: 'external',
        connectorId,
        connectorType: connection.connector.type,
      }
}

function isPrivyConnectorId(connectorId: string): boolean {
  return (
    connectorId === 'io.privy.wallet' ||
    connectorId.startsWith('io.privy.wallet.')
  )
}

async function restorePrivyConnection(connector: Connector): Promise<void> {
  const config = getWagmiConfig()

  try {
    await waitForWagmiMount()
    await waitForReconnectToSettle(config)

    const connection = getConnection(config)
    if (connection.isConnected && connection.connector?.id === connector.id) {
      return
    }

    await reconnect(config, { connectors: [connector] })
  } catch (error) {
    console.warn('Privy EVM wallet restoration failed', error)
  }
}

async function restoreExternalConnection(
  target: Extract<RestorationTarget, { type: 'external' }>,
): Promise<void> {
  const config = getWagmiConfig()

  try {
    await waitForWagmiMount()
    await waitForReconnectToSettle(config)
    const connector = await getRestorationConnector(
      target.connectorId,
      target.connectorType,
    )

    if (connector) {
      await reconnect(config, { connectors: [connector] })
    }
  } catch (error) {
    console.warn('EVM wallet restoration failed', error)
  }
}

async function waitForWagmiMount(): Promise<void> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 0))
}

async function getRestorationConnector(
  connectorId: string,
  connectorType: string,
): Promise<Connector | CreateConnectorFn | undefined> {
  const connector = getConnectors(getWagmiConfig()).find(
    (connector) => connector.id === connectorId,
  )
  if (connector) return connector

  const adapterId = getEvmAdapterIdForConnector(connectorId, connectorType)
  if (!adapterId) return undefined

  return EvmAdapterConfig[adapterId]({ uid: undefined })
}

async function waitForReconnectToSettle(config: Config): Promise<void> {
  if (!isReconnectPending(config.state.status)) return

  await new Promise<void>((resolve) => {
    const unsubscribe = config.subscribe(
      (state) => state.status,
      (status) => {
        if (!isReconnectPending(status)) {
          unsubscribe()
          resolve()
        }
      },
    )

    if (!isReconnectPending(config.state.status)) {
      unsubscribe()
      resolve()
    }
  })
}

function isReconnectPending(status: Config['state']['status']): boolean {
  return status === 'connecting' || status === 'reconnecting'
}
