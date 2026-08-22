export function getWalletRestorationState({
  hasRegisteredConnection,
  isProviderReady,
  isConnecting,
  isConnected,
}: {
  hasRegisteredConnection: boolean
  isProviderReady: boolean
  isConnecting: boolean
  isConnected: boolean
}): boolean {
  return (
    !hasRegisteredConnection &&
    (!isProviderReady || isConnecting || isConnected)
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
