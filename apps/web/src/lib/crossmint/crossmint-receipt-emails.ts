import { isValidCrossmintReceiptEmail } from './validation'

export const CROSSMINT_RECEIPT_EMAILS_STORAGE_KEY =
  'sushi.crossmint.receipt-emails-by-wallet'

type CrossmintWalletNamespace = 'evm' | 'stellar' | 'svm'
type CrossmintReceiptEmailKey = `${CrossmintWalletNamespace}:${string}`

export type CrossmintReceiptEmailsByWallet = Partial<
  Record<CrossmintReceiptEmailKey, string>
>

export function getCrossmintReceiptEmailKey(
  namespace: CrossmintWalletNamespace,
  walletAddress: string,
): CrossmintReceiptEmailKey {
  const normalizedAddress =
    namespace === 'evm' ? walletAddress.toLowerCase() : walletAddress

  return `${namespace}:${normalizedAddress}`
}

export function parseCrossmintReceiptEmails(
  value: unknown,
): CrossmintReceiptEmailsByWallet {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [CrossmintReceiptEmailKey, string] =>
        isCrossmintReceiptEmailKey(entry[0]) &&
        typeof entry[1] === 'string' &&
        isValidCrossmintReceiptEmail(entry[1]),
    ),
  )
}

function isCrossmintReceiptEmailKey(
  value: string,
): value is CrossmintReceiptEmailKey {
  const separatorIndex = value.indexOf(':')
  const namespace = value.slice(0, separatorIndex)
  const walletAddress = value.slice(separatorIndex + 1)

  return (
    (namespace === 'evm' || namespace === 'stellar' || namespace === 'svm') &&
    walletAddress.length > 0 &&
    walletAddress.length <= 128
  )
}
