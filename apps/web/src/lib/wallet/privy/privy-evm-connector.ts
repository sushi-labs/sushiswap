import {
  ChainNotConfiguredError,
  type Config,
  type Connector,
  ConnectorNotConnectedError,
  type CreateConnectorFn,
} from '@wagmi/core'
import { findPersistedConnectorIdMatching } from 'src/lib/wagmi/config/persisted-connectors'
import {
  type Address,
  type EIP1193Provider,
  SwitchChainError,
  getAddress,
  numberToHex,
} from 'viem'
import {
  type DeferredPrivyEvmProvider,
  createDeferredPrivyEvmProvider,
} from './privy-evm-provider'
import {
  type PrivyRuntimeStore,
  privyRuntimeStore,
} from './privy-runtime-store'
import { PRIVY_WALLET_ICON } from './privy-wallet-icon'
import type {
  PrivyEvmWallet,
  PrivyRuntimeReadySnapshot,
  PrivyRuntimeSnapshot,
} from './types'
import { WaitForValueTimeoutError, waitForValue } from './wait-for-value'

export const PRIVY_EVM_CONNECTOR_ID = 'io.privy.wallet'
export const PRIVY_EVM_CONNECTOR_NAME = 'Email'
export const PRIVY_EVM_CONNECTOR_TYPE = 'privy'

export const PRIVY_EVM_CONNECTED_STORAGE_KEY = `${PRIVY_EVM_CONNECTOR_ID}.connected`
export const PRIVY_EVM_DISCONNECTED_STORAGE_KEY = `${PRIVY_EVM_CONNECTOR_ID}.disconnected`

// Bounds each non-interactive phase (runtime readiness, wallet surfacing,
// provider requests). Interactive phases such as the login modal are only
// cancellable, never timed out: users may take minutes to enter an OTP.
const DEFAULT_CONNECT_TIMEOUT_MS = 60_000
const DEFAULT_RECONNECT_TIMEOUT_MS = 30_000
const DEFAULT_PROVIDER_TIMEOUT_MS = 10_000
const LEGACY_PRIVY_EVM_CONNECTOR_ID_PATTERN =
  /^io\.privy\.wallet\.0x[0-9a-f]{40}$/i

interface PrivyEvmConnectorParameters {
  connectTimeoutMs?: number
  getWagmiState?(): Config['state'] | undefined
  providerTimeoutMs?: number
  reconnectTimeoutMs?: number
  runtimeStore?: PrivyRuntimeStore
}

interface ConnectionAttempt {
  controller: AbortController
  deadline: number
  timeoutMs: number
}

interface ConnectedSession {
  address: Address
  chainId: number
  /**
   * Set when the held provider was switched but Privy's React chain state
   * could not be aligned. Replacement providers built from that stale state
   * are moved back to the connection's chain instead of being trusted.
   */
  pendingRuntimeChainId?: number
  providerRefresh: number
  unsubscribe(): void
  wallet: PrivyEvmWallet
}

export class PrivyConnectorCancelledError extends Error {
  override readonly name = 'PrivyConnectorCancelledError'

  constructor(message = 'Privy EVM connection was cancelled') {
    super(message)
  }
}

export class PrivyRuntimeHostUnavailableError extends Error {
  override readonly name = 'PrivyRuntimeHostUnavailableError'

  constructor() {
    super('Privy runtime host is not mounted')
  }
}

function isLegacyPrivyEvmConnectorId(connectorId: string): boolean {
  return LEGACY_PRIVY_EVM_CONNECTOR_ID_PATTERN.test(connectorId)
}

export function isPrivyEvmConnectorId(connectorId: string): boolean {
  return (
    connectorId.toLowerCase() === PRIVY_EVM_CONNECTOR_ID ||
    isLegacyPrivyEvmConnectorId(connectorId)
  )
}

export function isPrivyEvmConnector(connector: Connector): boolean {
  return (
    connector.type === PRIVY_EVM_CONNECTOR_TYPE ||
    isPrivyEvmConnectorId(connector.id)
  )
}

export function getPrivyEvmConnector(config: Config): Connector | undefined {
  return config.connectors.find(
    (connector) => connector.id === PRIVY_EVM_CONNECTOR_ID,
  )
}

export function hasPrivyEvmReconnectIntent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return (
      window.localStorage.getItem(
        `wagmi.${PRIVY_EVM_CONNECTED_STORAGE_KEY}`,
      ) === 'true'
    )
  } catch {
    return false
  }
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error('Privy EVM request failed')
}

function isSameAddress(first: string, second: string): boolean {
  return first.toLowerCase() === second.toLowerCase()
}

function parseChainId(value: unknown): number {
  const chainId = Number(value)
  if (!Number.isSafeInteger(chainId) || chainId <= 0) {
    throw new Error('Privy returned an invalid EVM chain ID')
  }
  return chainId
}

function getRemainingTimeout(attempt: ConnectionAttempt): number {
  return Math.max(1, attempt.deadline - Date.now())
}

/** Interactive phases do not count against the deadline; restart it after. */
function resetDeadline(attempt: ConnectionAttempt): void {
  attempt.deadline = Date.now() + attempt.timeoutMs
}

function runAttemptOperation<T>(
  operation: Promise<T>,
  attempt: ConnectionAttempt,
  timeoutMessage: string | undefined,
): Promise<T> {
  if (attempt.controller.signal.aborted) {
    return Promise.reject(normalizeError(attempt.controller.signal.reason))
  }

  return new Promise<T>((resolve, reject) => {
    let settled = false
    const timeout =
      timeoutMessage === undefined
        ? undefined
        : setTimeout(() => {
            finish()
            reject(new WaitForValueTimeoutError(timeoutMessage))
          }, getRemainingTimeout(attempt))

    function finish(): void {
      if (settled) return
      settled = true
      if (timeout) clearTimeout(timeout)
      attempt.controller.signal.removeEventListener('abort', onAbort)
    }

    function onAbort(): void {
      if (settled) return
      finish()
      reject(normalizeError(attempt.controller.signal.reason))
    }

    attempt.controller.signal.addEventListener('abort', onAbort, {
      once: true,
    })
    operation.then(
      (value) => {
        if (settled) return
        finish()
        resolve(value)
      },
      (error: unknown) => {
        if (settled) return
        finish()
        reject(error)
      },
    )
  })
}

function runWithTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> {
  const attempt: ConnectionAttempt = {
    controller: new AbortController(),
    deadline: Date.now() + timeoutMs,
    timeoutMs,
  }
  return runAttemptOperation(operation, attempt, timeoutMessage)
}

/** Cancellable but never timed out: the user controls how long this takes. */
function runInteractiveOperation<T>(
  operation: Promise<T>,
  attempt: ConnectionAttempt,
): Promise<T> {
  return runAttemptOperation(operation, attempt, undefined)
}

/** A timeout while waiting for the runtime itself, as opposed to a provider. */
class PrivyRuntimeWaitTimeoutError extends WaitForValueTimeoutError {}

function getRuntimeError(snapshot: PrivyRuntimeSnapshot): Error | undefined {
  return snapshot.status === 'error' ? snapshot.error : undefined
}

async function waitForRuntime(
  runtimeStore: PrivyRuntimeStore,
  attempt: ConnectionAttempt,
  predicate: (snapshot: PrivyRuntimeSnapshot) => boolean,
): Promise<PrivyRuntimeSnapshot> {
  try {
    return await waitForValue({
      getError: getRuntimeError,
      getValue: runtimeStore.getSnapshot,
      predicate,
      signal: attempt.controller.signal,
      subscribe: runtimeStore.subscribe,
      timeoutMessage: 'Privy EVM connection timed out',
      timeoutMs: getRemainingTimeout(attempt),
    })
  } catch (error) {
    // Distinguish a runtime that never became usable from slow provider
    // requests: only the former justifies remounting Privy.
    if (error instanceof WaitForValueTimeoutError) {
      throw new PrivyRuntimeWaitTimeoutError(error.message)
    }
    throw error
  }
}

function isReadyWithWallets(
  snapshot: PrivyRuntimeSnapshot,
): snapshot is PrivyRuntimeReadySnapshot {
  return snapshot.status === 'ready' && snapshot.walletsReady
}

function requireReadySnapshot(
  snapshot: PrivyRuntimeSnapshot,
): PrivyRuntimeReadySnapshot {
  if (snapshot.status !== 'ready') {
    throw new Error('Privy runtime is unavailable')
  }
  return snapshot
}

async function safelyRunStorageOperation(
  operation: void | Promise<void> | undefined,
): Promise<void> {
  try {
    await operation
  } catch {}
}

/** Persists enough intent for Wagmi to finish connecting after an OAuth redirect. */
export async function preparePrivyEvmReconnect(config: Config): Promise<void> {
  await Promise.all([
    safelyRunStorageOperation(
      config.storage?.removeItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY),
    ),
    safelyRunStorageOperation(
      config.storage?.setItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true),
    ),
    safelyRunStorageOperation(
      config.storage?.setItem('recentConnectorId', PRIVY_EVM_CONNECTOR_ID),
    ),
  ])
}

export async function clearPrivyEvmReconnect(config: Config): Promise<void> {
  await safelyRunStorageOperation(
    config.storage?.removeItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
  )
}

export function privyEvmConnector({
  connectTimeoutMs = DEFAULT_CONNECT_TIMEOUT_MS,
  getWagmiState,
  providerTimeoutMs = DEFAULT_PROVIDER_TIMEOUT_MS,
  reconnectTimeoutMs = DEFAULT_RECONNECT_TIMEOUT_MS,
  runtimeStore = privyRuntimeStore,
}: PrivyEvmConnectorParameters = {}): CreateConnectorFn<EIP1193Provider> {
  return (config) => {
    let activeAttempt: ConnectionAttempt | undefined
    let connectedIntentOwner: ConnectionAttempt | undefined
    let session: ConnectedSession | undefined

    const provider: DeferredPrivyEvmProvider = createDeferredPrivyEvmProvider({
      switchChain: switchActiveChain,
    })

    function cancelActiveAttempt(error = new PrivyConnectorCancelledError()) {
      activeAttempt?.controller.abort(error)
      activeAttempt = undefined
    }

    function startAttempt(timeoutMs: number): ConnectionAttempt {
      const previousAttempt = activeAttempt
      if (previousAttempt) {
        // Superseding an attempt (e.g. a user click while Wagmi is still
        // restoring) only aborts it. The runtime is shared with the Solana
        // namespace and must not be remounted for that.
        cancelActiveAttempt(
          new PrivyConnectorCancelledError(
            'A newer Privy EVM connection replaced this request',
          ),
        )
      }
      const attempt: ConnectionAttempt = {
        controller: new AbortController(),
        deadline: Date.now() + timeoutMs,
        timeoutMs,
      }
      if (previousAttempt && connectedIntentOwner === previousAttempt) {
        connectedIntentOwner = attempt
      }
      activeAttempt = attempt
      return attempt
    }

    function assertActiveAttempt(attempt: ConnectionAttempt): void {
      if (activeAttempt !== attempt || attempt.controller.signal.aborted) {
        throw new PrivyConnectorCancelledError()
      }
    }

    function emitChainChanged(chainId: number): void {
      if (!Number.isSafeInteger(chainId) || chainId <= 0) return
      if (session) session.chainId = chainId
      config.emitter.emit('change', { chainId })
    }

    const onProviderChainChanged = (chainId: string): void => {
      emitChainChanged(Number(chainId))
    }

    function clearSession({ emitDisconnect }: { emitDisconnect: boolean }) {
      const currentSession = session
      if (!currentSession) return
      session = undefined
      currentSession.unsubscribe()
      provider.removeListener('chainChanged', onProviderChainChanged)
      provider.clearTarget()
      if (emitDisconnect) config.emitter.emit('disconnect')
    }

    async function refreshSessionProvider(
      expectedSession: ConnectedSession,
      wallet: PrivyEvmWallet,
    ): Promise<void> {
      const refresh = ++expectedSession.providerRefresh
      try {
        const nextProvider = await runWithTimeout(
          wallet.getEthereumProvider(),
          providerTimeoutMs,
          'Privy EVM provider replacement timed out',
        )
        if (
          session !== expectedSession ||
          refresh !== expectedSession.providerRefresh
        ) {
          return
        }

        let chainId = parseChainId(
          await runWithTimeout(
            nextProvider.request({ method: 'eth_chainId' }),
            providerTimeoutMs,
            'Privy EVM chain request timed out',
          ),
        )
        if (
          session !== expectedSession ||
          refresh !== expectedSession.providerRefresh
        ) {
          return
        }
        // Privy builds each provider from its React chain state. A chain that
        // Privy changed out-of-band is reported to Wagmi like any wallet
        // would, but state known to be stale (a failed alignment after our own
        // switch) must not flip the connection back.
        if (
          chainId !== expectedSession.chainId &&
          expectedSession.pendingRuntimeChainId !== undefined
        ) {
          const aligned = await switchProviderChain(
            nextProvider,
            wallet,
            expectedSession.chainId,
            (operation, message) =>
              runWithTimeout(operation, providerTimeoutMs, message),
          )
          if (
            session !== expectedSession ||
            refresh !== expectedSession.providerRefresh
          ) {
            return
          }
          chainId = expectedSession.chainId
          if (aligned) expectedSession.pendingRuntimeChainId = undefined
        }
        expectedSession.wallet = wallet
        provider.setTarget(nextProvider)
        if (chainId !== expectedSession.chainId) emitChainChanged(chainId)
      } catch {
        const currentSnapshot = runtimeStore.getSnapshot()
        if (
          session === expectedSession &&
          refresh === expectedSession.providerRefresh &&
          currentSnapshot.status === 'ready' &&
          currentSnapshot.evmWallet === wallet
        ) {
          clearSession({ emitDisconnect: true })
        }
      }
    }

    function onRuntimeChange(snapshot: PrivyRuntimeSnapshot): void {
      const currentSession = session
      if (!currentSession) return
      if (snapshot.status !== 'ready') {
        currentSession.providerRefresh += 1
        provider.clearTarget()
        return
      }

      if (!snapshot.authenticated) {
        // A Privy logout (from any namespace) ends the user's intent to keep
        // this wallet connected. Drop the reconnect flag so a later login
        // elsewhere cannot silently restore it; do not set the disconnect
        // shim, since the user did not disconnect through Wagmi.
        void clearConnectedIntent({ disconnected: false })
        clearSession({ emitDisconnect: true })
        return
      }

      if (!snapshot.evmWallet) {
        if (snapshot.walletsReady) {
          clearSession({ emitDisconnect: true })
        } else {
          currentSession.providerRefresh += 1
          provider.clearTarget()
        }
        return
      }

      if (!isSameAddress(snapshot.evmWallet.address, currentSession.address)) {
        clearSession({ emitDisconnect: true })
        return
      }

      if (
        snapshot.evmWallet === currentSession.wallet &&
        provider.getTarget()
      ) {
        return
      }
      const replacementWallet = snapshot.evmWallet
      void refreshSessionProvider(currentSession, replacementWallet)
    }

    function bindSession(
      wallet: PrivyEvmWallet,
      target: EIP1193Provider,
      chainId: number,
      pendingRuntimeChainId?: number,
    ): void {
      const address = getAddress(wallet.address)
      clearSession({ emitDisconnect: false })
      provider.setTarget(target)
      provider.on('chainChanged', onProviderChainChanged)
      const nextSession: ConnectedSession = {
        address,
        chainId,
        pendingRuntimeChainId,
        providerRefresh: 0,
        unsubscribe: () => undefined,
        wallet,
      }
      session = nextSession
      nextSession.unsubscribe = runtimeStore.subscribe(onRuntimeChange)
    }

    async function setConnectedIntent(): Promise<void> {
      await Promise.all([
        safelyRunStorageOperation(
          config.storage?.removeItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY),
        ),
        safelyRunStorageOperation(
          config.storage?.setItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true),
        ),
      ])
    }

    async function clearConnectedIntent({
      disconnected,
    }: {
      disconnected: boolean
    }): Promise<void> {
      await safelyRunStorageOperation(
        config.storage?.removeItem(PRIVY_EVM_CONNECTED_STORAGE_KEY),
      )
      if (disconnected) {
        await safelyRunStorageOperation(
          config.storage?.setItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY, true),
        )
      }
    }

    /**
     * Switches the held provider and then aligns Privy's React wallet state.
     * Returns whether that alignment succeeded; a completed provider switch is
     * never turned into a failed action because of the secondary update.
     */
    async function switchProviderChain(
      target: EIP1193Provider,
      wallet: PrivyEvmWallet,
      chainId: number,
      run: <T>(operation: Promise<T>, message: string) => Promise<T>,
    ): Promise<boolean> {
      await run(
        target.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: numberToHex(chainId) }],
        }),
        'Privy EVM provider chain switch timed out',
      )
      return run(
        wallet.switchChain(chainId),
        'Privy EVM runtime chain switch timed out',
      ).then(
        () => true,
        () => false,
      )
    }

    async function switchActiveChain(chainId: number): Promise<void> {
      const chain = config.chains.find((candidate) => candidate.id === chainId)
      if (!chain) {
        throw new SwitchChainError(new ChainNotConfiguredError())
      }

      const currentSession = session
      const target = provider.getTarget()
      if (!currentSession || !target) throw new ConnectorNotConnectedError()

      try {
        const aligned = await switchProviderChain(
          target,
          currentSession.wallet,
          chainId,
          (operation, message) =>
            runWithTimeout(operation, providerTimeoutMs, message),
        )
        if (session === currentSession) {
          currentSession.pendingRuntimeChainId = aligned ? undefined : chainId
          if (currentSession.chainId !== chainId) emitChainChanged(chainId)
        }
      } catch (error) {
        if (error instanceof SwitchChainError) throw error
        throw new SwitchChainError(normalizeError(error))
      }
    }

    return {
      icon: PRIVY_WALLET_ICON,
      id: PRIVY_EVM_CONNECTOR_ID,
      name: PRIVY_EVM_CONNECTOR_NAME,
      type: PRIVY_EVM_CONNECTOR_TYPE,
      async connect({ chainId, isReconnecting, withCapabilities } = {}) {
        const attempt = startAttempt(
          isReconnecting ? reconnectTimeoutMs : connectTimeoutMs,
        )
        try {
          if (!runtimeStore.getSnapshot().hostMounted) {
            throw new PrivyRuntimeHostUnavailableError()
          }

          runtimeStore.requestRuntime()
          let snapshot = requireReadySnapshot(
            await waitForRuntime(
              runtimeStore,
              attempt,
              (candidate) => candidate.status === 'ready',
            ),
          )
          assertActiveAttempt(attempt)

          if (isReconnecting) {
            snapshot = requireReadySnapshot(
              await waitForRuntime(runtimeStore, attempt, isReadyWithWallets),
            )
            assertActiveAttempt(attempt)
            if (!snapshot.authenticated || !snapshot.evmWallet) {
              await clearConnectedIntent({ disconnected: false })
              throw new Error('Privy EVM session is not restorable')
            }
          } else {
            if (!snapshot.authenticated) {
              // The login modal opens as soon as auth is ready; the embedded
              // wallet iframe only has to be up once there is a user to serve.
              await runInteractiveOperation(
                snapshot.operations.connectOrCreateEvmWallet(),
                attempt,
              )
              resetDeadline(attempt)
            }

            snapshot = requireReadySnapshot(
              await waitForRuntime(
                runtimeStore,
                attempt,
                (candidate) =>
                  isReadyWithWallets(candidate) && candidate.authenticated,
              ),
            )
            assertActiveAttempt(attempt)

            if (
              snapshot.authenticated &&
              !snapshot.evmWallet &&
              !snapshot.hasEvmAccount
            ) {
              // Provisioning may prompt for recovery setup; treat it as
              // interactive as well.
              await runInteractiveOperation(
                snapshot.operations.connectOrCreateEvmWallet(),
                attempt,
              )
              resetDeadline(attempt)
            }

            snapshot = requireReadySnapshot(
              await waitForRuntime(
                runtimeStore,
                attempt,
                (candidate) =>
                  isReadyWithWallets(candidate) &&
                  candidate.authenticated &&
                  Boolean(candidate.evmWallet),
              ),
            )
          }

          assertActiveAttempt(attempt)
          if (!snapshot.authenticated || !snapshot.evmWallet) {
            throw new Error('Privy EVM wallet is unavailable')
          }

          await setConnectedIntent()
          if (!isReconnecting) connectedIntentOwner = attempt

          let wallet = snapshot.evmWallet
          let pendingRuntimeChainId: number | undefined
          while (true) {
            const target = await runAttemptOperation(
              wallet.getEthereumProvider(),
              attempt,
              'Privy EVM provider request timed out',
            )
            let currentChainId = parseChainId(
              await runAttemptOperation(
                target.request({ method: 'eth_chainId' }),
                attempt,
                'Privy EVM chain request timed out',
              ),
            )

            if (chainId && currentChainId !== chainId) {
              const chain = config.chains.find(
                (candidate) => candidate.id === chainId,
              )
              if (!chain) {
                throw new SwitchChainError(new ChainNotConfiguredError())
              }
              const aligned = await switchProviderChain(
                target,
                wallet,
                chainId,
                (operation, message) =>
                  runAttemptOperation(operation, attempt, message),
              )
              pendingRuntimeChainId = aligned ? undefined : chainId
              currentChainId = chainId
            }

            // Nothing after this block may yield before bindSession/return.
            // Wagmi reconnect replaces hydrated connections on its first
            // success, so a user-selected wallet that won meanwhile must not
            // be overwritten by this delayed restoration.
            assertActiveAttempt(attempt)
            const currentSnapshot = runtimeStore.getSnapshot()
            if (
              currentSnapshot.status !== 'ready' ||
              !currentSnapshot.authenticated ||
              !currentSnapshot.evmWallet ||
              !isSameAddress(currentSnapshot.evmWallet.address, wallet.address)
            ) {
              throw new PrivyConnectorCancelledError(
                'Privy EVM wallet changed during connection',
              )
            }
            if (currentSnapshot.evmWallet !== wallet) {
              wallet = currentSnapshot.evmWallet
              continue
            }
            const wagmiState = getWagmiState?.()
            const currentConnectorId = wagmiState?.current
              ? wagmiState.connections.get(wagmiState.current)?.connector.id
              : undefined
            if (
              isReconnecting &&
              currentConnectorId &&
              !isPrivyEvmConnectorId(currentConnectorId)
            ) {
              await clearConnectedIntent({ disconnected: false })
              throw new PrivyConnectorCancelledError(
                'Another EVM wallet connected while Privy was restoring',
              )
            }

            bindSession(wallet, target, currentChainId, pendingRuntimeChainId)
            connectedIntentOwner = undefined

            const accounts = [getAddress(wallet.address)] as const
            return {
              // Wagmi models this return value with a conditional generic. The
              // runtime branch is the same one used by its built-in connectors.
              accounts: (withCapabilities
                ? accounts.map((address) => ({ address, capabilities: {} }))
                : accounts) as never,
              chainId: currentChainId,
            }
          }
        } catch (error) {
          if (!session) provider.clearTarget()
          // Remount Privy only when a user-initiated connection waited out the
          // runtime itself (import, mount, or wallet surfacing stalled). A
          // slow restore is left alone: the runtime keeps loading for the
          // session and a user click reuses it.
          if (
            !isReconnecting &&
            error instanceof PrivyRuntimeWaitTimeoutError &&
            activeAttempt === attempt
          ) {
            runtimeStore.restartRuntime()
          }
          if (connectedIntentOwner === attempt && !session) {
            connectedIntentOwner = undefined
            await clearConnectedIntent({ disconnected: false })
          }
          throw error
        } finally {
          if (activeAttempt === attempt) activeAttempt = undefined
        }
      },
      async disconnect() {
        cancelActiveAttempt()
        connectedIntentOwner = undefined
        clearSession({ emitDisconnect: false })
        provider.clearTarget()
        await clearConnectedIntent({ disconnected: true })
      },
      async getAccounts() {
        if (!session) throw new ConnectorNotConnectedError()
        return [session.address]
      },
      async getChainId() {
        if (!session) throw new ConnectorNotConnectedError()
        return session.chainId
      },
      async getProvider() {
        return provider
      },
      async isAuthorized() {
        try {
          if (
            await config.storage?.getItem(PRIVY_EVM_DISCONNECTED_STORAGE_KEY)
          ) {
            return false
          }
          if (await config.storage?.getItem(PRIVY_EVM_CONNECTED_STORAGE_KEY)) {
            return true
          }

          const legacyId = findPersistedConnectorIdMatching(
            isLegacyPrivyEvmConnectorId,
          )
          if (!legacyId) return false
          if (await config.storage?.getItem(`${legacyId}.disconnected`)) {
            return false
          }

          await safelyRunStorageOperation(
            config.storage?.setItem(PRIVY_EVM_CONNECTED_STORAGE_KEY, true),
          )
          const recentConnectorId =
            await config.storage?.getItem('recentConnectorId')
          if (recentConnectorId === legacyId) {
            await safelyRunStorageOperation(
              config.storage?.setItem(
                'recentConnectorId',
                PRIVY_EVM_CONNECTOR_ID,
              ),
            )
          }
          return true
        } catch {
          return false
        }
      },
      onAccountsChanged(accounts) {
        if (accounts.length === 0) {
          clearSession({ emitDisconnect: true })
          return
        }
        if (!session) return
        config.emitter.emit('change', {
          accounts: accounts.map((address) => getAddress(address)),
        })
      },
      onChainChanged(chainId) {
        emitChainChanged(Number(chainId))
      },
      onDisconnect() {
        clearSession({ emitDisconnect: true })
      },
      async switchChain({ chainId }) {
        const chain = config.chains.find(
          (candidate) => candidate.id === chainId,
        )
        if (!chain) {
          throw new SwitchChainError(new ChainNotConfiguredError())
        }
        await switchActiveChain(chainId)
        return chain
      },
    }
  }
}
