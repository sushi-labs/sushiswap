export function getWalletRestorationState({
  hasRegisteredConnection,
  isProviderReady,
  isAutoConnectPending = false,
  isConnecting,
  isConnected,
}: {
  hasRegisteredConnection: boolean
  isProviderReady: boolean
  isAutoConnectPending?: boolean
  isConnecting: boolean
  isConnected: boolean
}): boolean {
  return (
    !hasRegisteredConnection &&
    (!isProviderReady || isAutoConnectPending || isConnecting || isConnected)
  )
}

export function getIsPrivyWalletProviderReady({
  isAuthReady,
  isAuthenticated,
  areWalletsReady,
}: {
  isAuthReady: boolean
  isAuthenticated: boolean
  areWalletsReady: boolean
}): boolean {
  return isAuthReady && (!isAuthenticated || areWalletsReady)
}
