// type UseWalletState = (
//   hook: ReturnType<typeof useConnect>,
//   account: string
// ) => {
//   connecting: boolean
//   notConnected: boolean
//   pendingConnection: boolean
//   reconnecting: boolean
// }

// Mutually exclusive states
export const useWalletState = (useConnect, account) => {
  const { isConnecting, pendingConnector, isReconnecting } = useConnect

  // Trying to see if wallet is connected
  const connecting = Boolean(isConnecting && !isReconnecting && !pendingConnector && !account)

  // No wallet connected
  const notConnected = Boolean(!isConnecting && !isReconnecting && !pendingConnector && !account)

  // pending wallet confirmation
  const pendingConnection = Boolean(isConnecting && !isReconnecting && !!pendingConnector && !account)

  // We are reconnecting
  const reconnecting = Boolean(isReconnecting && account)

  return {
    connecting,
    notConnected,
    pendingConnection,
    reconnecting,
  }
}
