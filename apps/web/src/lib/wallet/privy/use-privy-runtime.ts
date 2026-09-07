'use client'

import { useSyncExternalStore } from 'react'
import type { SvmAddress } from 'sushi/svm'
import { setPrivySvmReconnect } from '../privy-storage'
import type { WalletLoginMethod } from '../types'
import { privyRuntimeStore } from './privy-runtime-store'
import type {
  PrivyLoginWalletChainType,
  PrivyRuntimeReadySnapshot,
  PrivyRuntimeSnapshot,
} from './types'
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
    subscribe: privyRuntimeStore.subscribe,
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

export async function authenticatePrivyRuntime(
  loginMethod: WalletLoginMethod,
  walletChainType: PrivyLoginWalletChainType,
): Promise<void> {
  let snapshot = await loadPrivyRuntime()
  if (snapshot.authenticated && snapshot.loginMethod === loginMethod) return

  if (snapshot.authenticated) {
    await snapshot.operations.logout()
    snapshot = await waitForReadyPrivyRuntime(
      (candidate) => !candidate.authenticated,
    )
  }

  await snapshot.operations.authenticate(loginMethod, walletChainType)
  snapshot = await waitForReadyPrivyRuntime(
    (candidate) =>
      candidate.authenticated && candidate.loginMethod === loginMethod,
  )
  if (!snapshot.authenticated) {
    throw new Error('Privy authentication failed')
  }
}

export async function connectPrivySvmWallet(
  loginMethod?: WalletLoginMethod,
): Promise<SvmAddress> {
  let snapshot = await loadPrivyRuntime()
  if (loginMethod) {
    await authenticatePrivyRuntime(loginMethod, 'solana-only')
    snapshot = await waitForReadyPrivyRuntime(
      (candidate) =>
        candidate.authenticated && candidate.loginMethod === loginMethod,
    )
  }
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
  setPrivySvmReconnect(false)
  if (snapshot.status === 'ready') await snapshot.operations.logout()
}
