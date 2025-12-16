export async function isSafeAppAvailable(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  try {
    const { default: SafeAppsSDK } = await import('@safe-global/safe-apps-sdk')
    const sdk = new SafeAppsSDK()

    // In a Safe iframe this resolves with safe info; outside it typically rejects/throws.
    await sdk.safe.getInfo()
    return true
  } catch {
    return false
  }
}
