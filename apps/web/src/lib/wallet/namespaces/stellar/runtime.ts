import {
  type ISupportedWallet,
  KitEventType,
} from '@creit.tech/stellar-wallets-kit'
import { selectedModuleId } from '@creit.tech/stellar-wallets-kit/state'
import type { StellarAddress } from 'sushi/stellar'
import { stellarWalletKit } from './config'

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
  const moduleId = selectedModuleId.value
  if (!moduleId) return undefined

  const [{ address }, supportedWallets] = await Promise.all([
    stellarWalletKit.getAddress(),
    stellarWalletKit.refreshSupportedWallets(),
  ])

  return {
    account: address as StellarAddress,
    moduleId,
    wallet: supportedWallets.find((wallet) => wallet.id === moduleId),
  }
}

export function subscribeToStellarWallet({
  onDisconnected,
  onStateUpdated,
}: StellarWalletSubscription): () => void {
  const unsubscribeStateUpdated = stellarWalletKit.on(
    KitEventType.STATE_UPDATED,
    onStateUpdated,
  )
  const unsubscribeDisconnected = stellarWalletKit.on(
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
  stellarWalletKit.setWallet(moduleId)
  const { address } = await stellarWalletKit.fetchAddress()
  return address as StellarAddress
}

export function disconnectStellarWallet(): Promise<void> {
  return stellarWalletKit.disconnect()
}
