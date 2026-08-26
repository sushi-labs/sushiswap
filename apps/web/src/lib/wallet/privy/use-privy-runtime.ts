'use client'

import { type Config, connect, getConnectors } from '@wagmi/core'
import { useSyncExternalStore } from 'react'
import type { EvmAddress } from 'sushi/evm'
import type { SvmAddress } from 'sushi/svm'
import { clearPrivySessionMarker } from '../privy-session-marker'
import { PRIVY_EVM_CONNECTOR_ID } from './privy-evm-connector'
import { privyRuntimeStore } from './privy-runtime-store'
import type { PrivyRuntimeReadySnapshot, PrivyRuntimeSnapshot } from './types'
import { waitForValue } from './wait-for-value'

const RUNTIME_TIMEOUT_MS = 30_000

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

  return connectPublishedPrivyEvmWallet(config)
}

export async function reconnectPrivyEvmWallet(
  config: Config,
): Promise<EvmAddress> {
  const snapshot = privyRuntimeStore.getSnapshot()
  if (snapshot.status !== 'ready' || !snapshot.evmWallet) {
    throw new Error('Privy EVM wallet is unavailable for reconnection')
  }
  return connectPublishedPrivyEvmWallet(config)
}

async function connectPublishedPrivyEvmWallet(
  config: Config,
): Promise<EvmAddress> {
  const connector = getConnectors(config).find(
    (candidate) => candidate.id === PRIVY_EVM_CONNECTOR_ID,
  )
  if (!connector) throw new Error('Privy EVM connector is unavailable')

  const { accounts } = await connect(config, { connector })
  return accounts[0] as EvmAddress
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
