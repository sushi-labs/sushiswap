'use client'

import { useStandardWallets } from '@privy-io/react-auth/solana'
import type { ConnectorClient } from '@solana/connector'
import type {
  Wallet,
  WalletEventsWindow,
  WindowRegisterWalletEvent,
  WindowRegisterWalletEventCallback,
} from '@wallet-standard/base'
import { useEffect, useRef } from 'react'

type ConnectorClientInternals = {
  walletDetector?: { refreshWallets?: () => void }
  autoConnector?: { attemptAutoConnect?: () => Promise<boolean> }
  getSnapshot: ConnectorClient['getSnapshot']
}

export function useRegisterPrivySvmWallet(
  client: ConnectorClient | null,
): void {
  const { ready, wallets } = useStandardWallets()
  const registeredWalletRef = useRef<Wallet | null>(null)

  useEffect(() => {
    if (!ready) return

    const privyWallet = wallets.find(isPrivySvmWallet)
    if (!privyWallet || registeredWalletRef.current === privyWallet) return

    registeredWalletRef.current = privyWallet
    registerWallet(privyWallet)

    const connectorClient = client as unknown as ConnectorClientInternals | null
    connectorClient?.walletDetector?.refreshWallets?.()

    if (connectorClient?.getSnapshot().wallet.status === 'connected') return

    connectorClient?.autoConnector?.attemptAutoConnect?.().catch((error) => {
      console.warn('Privy SVM auto-connect failed', error)
    })
  }, [ready, wallets, client])
}

function isPrivySvmWallet(wallet: Wallet): boolean {
  return wallet.name === 'Privy' && 'privy:' in wallet.features
}

class RegisterWalletEvent
  extends CustomEvent<WindowRegisterWalletEventCallback>
  implements WindowRegisterWalletEvent
{
  readonly #detail: WindowRegisterWalletEventCallback

  get detail() {
    return this.#detail
  }

  get type() {
    return 'wallet-standard:register-wallet' as const
  }

  constructor(callback: WindowRegisterWalletEventCallback) {
    super('wallet-standard:register-wallet', {
      bubbles: false,
      cancelable: false,
      detail: callback,
    })
    this.#detail = callback
  }

  preventDefault(): never {
    throw new Error('preventDefault is not supported')
  }

  stopPropagation(): never {
    throw new Error('stopPropagation is not supported')
  }

  stopImmediatePropagation(): never {
    throw new Error('stopImmediatePropagation is not supported')
  }
}

function registerWallet(wallet: Wallet): void {
  const callback: WindowRegisterWalletEventCallback = ({ register }) =>
    register(wallet)
  try {
    ;(window as WalletEventsWindow).dispatchEvent(
      new RegisterWalletEvent(callback),
    )
  } catch (error) {
    console.error(
      'wallet-standard:register-wallet event could not be dispatched\n',
      error,
    )
  }
  try {
    ;(window as WalletEventsWindow).addEventListener(
      'wallet-standard:app-ready',
      ({ detail: api }) => callback(api),
    )
  } catch (error) {
    console.error(
      'wallet-standard:app-ready event listener could not be added\n',
      error,
    )
  }
}
