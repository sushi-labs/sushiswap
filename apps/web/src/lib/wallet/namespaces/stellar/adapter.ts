export enum StellarAdapterId {
  Standard = 'stellar-standard',
}

const STELLAR_WALLET_ID_PREFIX = 'stellar:'

export const STELLAR_SELECTED_MODULE_STORAGE_KEY =
  '@StellarWalletsKit/selectedModuleId'

export function getStellarWalletId(moduleId: string): string {
  return `${STELLAR_WALLET_ID_PREFIX}${moduleId.toLowerCase()}`
}

export function getStellarModuleId(walletId: string): string | undefined {
  if (!walletId.startsWith(STELLAR_WALLET_ID_PREFIX)) return undefined

  const moduleId = walletId.slice(STELLAR_WALLET_ID_PREFIX.length)
  return moduleId || undefined
}
