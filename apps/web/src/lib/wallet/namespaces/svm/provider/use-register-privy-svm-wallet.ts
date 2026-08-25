'use client'

import type {
  Wallet,
  WalletEventsWindow,
  WindowRegisterWalletEvent,
  WindowRegisterWalletEventCallback,
} from '@wallet-standard/base'
import { useEffect } from 'react'
import { usePrivyEmbeddedWallet } from 'src/lib/wallet/hooks/use-privy-embedded'

export function useRegisterPrivySvmWallet(): void {
  const privyWallet = usePrivyEmbeddedWallet('svm')
  const standardWallet = privyWallet?.standardWallet

  useEffect(() => {
    if (!standardWallet) return
    return registerWallet(standardWallet)
  }, [standardWallet])
}

//https://docs.privy.io/recipes/solana/standard-wallets#registering-the-privy-embedded-wallet
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

export function registerWallet(wallet: Wallet): () => void {
  const unregisters = new Set<() => void>()
  const callback: WindowRegisterWalletEventCallback = ({ register }) => {
    unregisters.add(register(wallet))
  }
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
  const onAppReady = ({ detail: api }: CustomEvent) => callback(api)
  try {
    ;(window as WalletEventsWindow).addEventListener(
      'wallet-standard:app-ready',
      onAppReady as EventListener,
    )
  } catch (error) {
    console.error(
      'wallet-standard:app-ready event listener could not be added\n',
      error,
    )
  }

  return () => {
    ;(window as WalletEventsWindow).removeEventListener(
      'wallet-standard:app-ready',
      onAppReady as EventListener,
    )
    for (const unregister of unregisters) unregister()
    unregisters.clear()
  }
}
