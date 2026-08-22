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
