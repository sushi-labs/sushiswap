'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

type UseWalletStateReturn = {
  isConnected: boolean
  isDisconnected: boolean
  connecting: boolean
  notConnected: boolean
  pendingConnection: boolean
  reconnecting: boolean
}

type UseWalletState = (pendingConnector: boolean) => UseWalletStateReturn

// Mutually exclusive states
// TODO ramin: remove pendingConnector param when wagmi adds onConnecting callback to useAccount
export const useWalletState: UseWalletState = (pendingConnector) => {
  const [initialDc, setInitialDc] = useState(true)

  const { address, isConnecting, isReconnecting, isConnected, isDisconnected } =
    useAccount()

  // Trying to see if wallet is connected
  const connecting =
    Boolean(isConnecting && !isReconnecting && !pendingConnector && !address) ||
    initialDc

  // No wallet connected
  const notConnected = Boolean(
    !isConnecting && !isReconnecting && !pendingConnector && !address,
  )

  // pending wallet confirmation
  const pendingConnection = Boolean(
    isConnecting && !isReconnecting && pendingConnector && !address,
  )

  // We are reconnecting
  const reconnecting = Boolean(isReconnecting && address)

  useEffect(() => {
    if (initialDc && connecting) {
      setInitialDc(false)
    }
  }, [connecting, initialDc])

  return {
    isConnected,
    isDisconnected,
    connecting,
    notConnected,
    pendingConnection,
    reconnecting,
  }
}
