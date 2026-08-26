'use client'

import {
  type Config,
  type Connector,
  getConnections,
  reconnect,
} from '@wagmi/core'
import { useSyncExternalStore } from 'react'
import type { EvmAddress } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import { clearPrivySessionMarker } from '../privy-session-marker'
import {
  PRIVY_EVM_CONNECTOR_ID,
  getPrivyEvmConnector,
} from './privy-evm-connector'
import { privyRuntimeStore } from './privy-runtime-store'
import type { PrivyRuntimeReadySnapshot, PrivyRuntimeSnapshot } from './types'
import { waitForValue } from './wait-for-value'

const RUNTIME_TIMEOUT_MS = 30_000
const CONNECTOR_TIMEOUT_MS = 10_000

const evmActivations = new WeakMap<
  Config,
  { address: EvmAddress; promise: Promise<EvmAddress> }
>()

function subscribe(listener: () => void): () => void {
  return privyRuntimeStore.subscribe(listener)
}

export function usePrivyRuntime(): PrivyRuntimeSnapshot {
  return useSyncExternalStore(
    subscribe,
    privyRuntimeStore.getSnapshot,
    privyRuntimeStore.getSnapshot,
  )
}

function waitForPrivyRuntime(
  predicate: (snapshot: PrivyRuntimeSnapshot) => boolean,
): Promise<PrivyRuntimeSnapshot> {
  return waitForValue({
    getError: (snapshot) =>
      snapshot.status === 'error' ? snapshot.error : undefined,
    getValue: privyRuntimeStore.getSnapshot,
    predicate,
    subscribe: (listener) => privyRuntimeStore.subscribe(listener),
    timeoutMessage: 'Privy runtime timed out',
    timeoutMs: RUNTIME_TIMEOUT_MS,
  })
}

async function waitForReadyPrivyRuntime(
  predicate: (snapshot: PrivyRuntimeReadySnapshot) => boolean = () => true,
): Promise<PrivyRuntimeReadySnapshot> {
  const snapshot = await waitForPrivyRuntime(
    (candidate) => candidate.status === 'ready' && predicate(candidate),
  )
  if (snapshot.status !== 'ready') {
    throw new Error('Privy runtime is unavailable')
  }
  return snapshot
}

export async function loadPrivyRuntime(): Promise<PrivyRuntimeReadySnapshot> {
  privyRuntimeStore.requestRuntime()
  return waitForReadyPrivyRuntime()
}

export async function connectPrivyEvmWallet(
  config: Config,
): Promise<EvmAddress> {
  let snapshot = await loadPrivyRuntime()
  if (!snapshot.evmWallet) {
    // The wallet list surfaces later than the linked account does. Calling
    // `createWallet()` in that window throws "User already has an embedded
    // wallet.", so an existing account means wait rather than provision.
    if (!snapshot.authenticated || !snapshot.hasEvmAccount) {
      await snapshot.operations.connectOrCreateEvmWallet()
    }
    snapshot = await waitForReadyPrivyRuntime((candidate) =>
      Boolean(candidate.evmWallet),
    )
  }

  if (!snapshot.evmWallet) throw new Error('Privy EVM wallet is unavailable')
  return activatePrivyEvmWallet(config, snapshot.evmWallet.address)
}

export async function reconnectPrivyEvmWallet(
  config: Config,
): Promise<EvmAddress> {
  const snapshot = privyRuntimeStore.getSnapshot()
  const readySnapshot =
    snapshot.status === 'ready' && snapshot.evmWallet
      ? snapshot
      : await waitForReadyPrivyRuntime((candidate) =>
          Boolean(candidate.evmWallet),
        )
  if (!readySnapshot.evmWallet) {
    throw new Error('Privy EVM wallet is unavailable for reconnection')
  }
  return activatePrivyEvmWallet(config, readySnapshot.evmWallet.address)
}

function getConnectedPrivyAddress(
  config: Config,
  expectedAddress: EvmAddress,
): EvmAddress | undefined {
  const connectedAddress = getConnections(config).find(
    (connection) => connection.connector.id === PRIVY_EVM_CONNECTOR_ID,
  )?.accounts[0] as EvmAddress | undefined
  return connectedAddress?.toLowerCase() === expectedAddress.toLowerCase()
    ? connectedAddress
    : undefined
}

async function waitForPrivyEvmConnector(
  config: Config,
  address: EvmAddress,
): Promise<Connector> {
  const connector = await waitForValue<Connector | undefined>({
    getValue: () => getPrivyEvmConnector(config, address),
    predicate: Boolean,
    subscribe: (listener) => config._internal.connectors.subscribe(listener),
    timeoutMessage: 'Privy EVM connector was not registered',
    timeoutMs: CONNECTOR_TIMEOUT_MS,
  })
  if (!connector) throw new Error('Privy EVM connector is unavailable')
  return connector
}

async function waitForWagmiIdle(config: Config): Promise<void> {
  await waitForValue({
    getValue: () => config.state.status,
    predicate: (status) => status !== 'connecting' && status !== 'reconnecting',
    subscribe: (listener) =>
      config.subscribe((state) => state.status, listener),
    timeoutMessage: 'Wagmi reconnection timed out',
    timeoutMs: CONNECTOR_TIMEOUT_MS,
  })
}

async function activatePrivyEvmWallet(
  config: Config,
  expectedAddress: EvmAddress,
): Promise<EvmAddress> {
  const connectedAddress = getConnectedPrivyAddress(config, expectedAddress)
  if (connectedAddress) return connectedAddress

  const active = evmActivations.get(config)
  if (active) {
    if (active.address.toLowerCase() === expectedAddress.toLowerCase()) {
      return active.promise
    }
    await active.promise.catch(() => undefined)
    if (evmActivations.get(config)?.promise === active.promise) {
      evmActivations.delete(config)
    }
    return activatePrivyEvmWallet(config, expectedAddress)
  }

  const promise = (async () => {
    const connector = await waitForPrivyEvmConnector(config, expectedAddress)
    await Promise.all([
      config.storage?.removeItem(`${PRIVY_EVM_CONNECTOR_ID}.disconnected`),
      config.storage?.setItem('recentConnectorId', PRIVY_EVM_CONNECTOR_ID),
    ])

    // Wagmi's reconnect action has a process-wide lock. The initial provider
    // reconnect can still be finishing when Privy's lazy connector appears,
    // so wait for it and retry once if another reconnect wins the race.
    for (let attempt = 0; attempt < 2; attempt++) {
      await waitForWagmiIdle(config)
      const currentAddress = getConnectedPrivyAddress(config, expectedAddress)
      if (currentAddress) return currentAddress

      const connections = await reconnect(config, { connectors: [connector] })
      const address = connections.find(
        (connection) => connection.connector.id === PRIVY_EVM_CONNECTOR_ID,
      )?.accounts[0] as EvmAddress | undefined
      if (address?.toLowerCase() === expectedAddress.toLowerCase()) {
        return address
      }
    }

    throw new Error('Privy EVM wallet could not reconnect')
  })()
  evmActivations.set(config, { address: expectedAddress, promise })

  try {
    return await promise
  } finally {
    if (evmActivations.get(config)?.promise === promise) {
      evmActivations.delete(config)
    }
  }
}

export async function connectPrivySvmWallet(): Promise<SvmAddress> {
  let snapshot = await loadPrivyRuntime()
  if (!snapshot.svmWallet) {
    if (!snapshot.authenticated || !snapshot.hasSvmAccount) {
      await snapshot.operations.loginSvm()
    }
    snapshot = await waitForReadyPrivyRuntime((candidate) =>
      Boolean(candidate.svmWallet),
    )
  }

  if (!snapshot.svmWallet) throw new Error('Privy SVM wallet is unavailable')
  return snapshot.svmWallet.address
}

export async function logoutPrivyRuntime(): Promise<void> {
  const snapshot = privyRuntimeStore.getSnapshot()
  clearPrivySessionMarker()
  // Drop the pending auto-reconnect synchronously so a later login in another
  // namespace cannot silently reconnect the wallet the user just disconnected.
  privyRuntimeStore.clearEvmReconnect()
  if (snapshot.status === 'ready') await snapshot.operations.logout()
}
