import type { ISupportedWallet } from '@creit.tech/stellar-wallets-kit'
import type { StellarAddress } from 'sushi/stellar'
import { getStellarWalletKit } from './config'

export interface StellarWalletConnection {
  account: StellarAddress
  moduleId: string
  wallet: ISupportedWallet | undefined
}

interface StellarWalletSubscription {
  onDisconnected: () => void
  onStateUpdated: () => void
}

export async function getStellarWalletConnection(): Promise<
  StellarWalletConnection | undefined
> {
  const kit = await getStellarWalletKit()
  const { activeAddress, selectedModuleId } = await import(
    '@creit.tech/stellar-wallets-kit/state'
  )

  // The kit's signals are the source of truth: they are set the moment a
  // wallet is selected, while their localStorage mirrors are written by a
  // separate signals effect.
  const moduleId = selectedModuleId.value
  if (!moduleId) return undefined

  // A wallet is selected but its address has not arrived yet: that is the
  // normal state while `fetchAddress()` waits on the extension prompt, not a
  // failure. Calling `kit.getAddress()` here would throw, and the caller
  // treats a throw as a dead session and disconnects the kit mid-connect.
  if (!activeAddress.value) return undefined

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
 * Resolves once the listeners are attached, so callers can guarantee they are
 * in place before triggering a connect. Attaching them after the kit had
 * already emitted meant a first connect could be missed and then rolled back.
 */
export async function subscribeToStellarWallet({
  onDisconnected,
  onStateUpdated,
}: StellarWalletSubscription): Promise<() => void> {
  const [kit, { KitEventType }] = await Promise.all([
    getStellarWalletKit(),
    import('@creit.tech/stellar-wallets-kit'),
  ])

  const unsubscribeStateUpdated = kit.on(
    KitEventType.STATE_UPDATED,
    onStateUpdated,
  )
  const unsubscribeDisconnected = kit.on(
    KitEventType.DISCONNECT,
    onDisconnected,
  )

  return () => {
    unsubscribeStateUpdated()
    unsubscribeDisconnected()
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
