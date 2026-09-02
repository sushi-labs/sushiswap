import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import type { StellarAddress } from 'sushi/stellar'
import {
  STELLAR_SELECTED_MODULE_STORAGE_KEY,
  getStellarWalletKit,
} from './config'

export interface StellarWalletConnection {
  account: StellarAddress
  moduleId: string
  wallet: ISupportedWallet | undefined
}

interface StellarWalletSubscription {
  onDisconnected: () => void
  onStateUpdated: () => void
}

/**
 * The kit persists its selected module, so a disconnected visitor can be
 * recognised without loading the kit at all.
 */
function getPersistedModuleId(): string | undefined {
  return (
    globalThis.localStorage?.getItem(STELLAR_SELECTED_MODULE_STORAGE_KEY) ??
    undefined
  )
}

export async function getStellarWalletConnection(): Promise<
  StellarWalletConnection | undefined
> {
  if (!getPersistedModuleId()) return undefined

  const kit = await getStellarWalletKit()
  const { selectedModuleId } = await import(
    '@creit.tech/stellar-wallets-kit/state'
  )

  const moduleId = selectedModuleId.value
  if (!moduleId) return undefined

  const [{ address }, supportedWallets] = await Promise.all([
    kit.getAddress(),
    kit.refreshSupportedWallets(),
  ])

  return {
    account: address as StellarAddress,
    moduleId,
    wallet: supportedWallets.find((wallet) => wallet.id === moduleId),
  }
}

/**
 * Keeps a synchronous signature so callers can treat it like any other
 * subscribe: the listeners attach once the kit resolves, and unsubscribing
 * before then cancels the attach.
 */
export function subscribeToStellarWallet({
  onDisconnected,
  onStateUpdated,
}: StellarWalletSubscription): () => void {
  let cancelled = false
  let detach: (() => void) | undefined

  void (async () => {
    try {
      const [kit, { KitEventType }] = await Promise.all([
        getStellarWalletKit(),
        import('@creit.tech/stellar-wallets-kit'),
      ])
      if (cancelled) return

      const unsubscribeStateUpdated = kit.on(
        KitEventType.STATE_UPDATED,
        onStateUpdated,
      )
      const unsubscribeDisconnected = kit.on(
        KitEventType.DISCONNECT,
        onDisconnected,
      )
      detach = () => {
        unsubscribeStateUpdated()
        unsubscribeDisconnected()
      }
    } catch (error) {
      console.error('Failed to subscribe to the Stellar wallet', error)
    }
  })()

  return () => {
    cancelled = true
    detach?.()
    detach = undefined
  }
}

export async function connectStellarWallet(
  moduleId: string,
): Promise<StellarAddress> {
  const kit = await getStellarWalletKit()
  kit.setWallet(moduleId)
  const { address } = await kit.fetchAddress()
  return address as StellarAddress
}

export async function disconnectStellarWallet(): Promise<void> {
  const kit = await getStellarWalletKit()
  return kit.disconnect()
}
