export function getValueTransferQuoteExpiry(expiresAt: string): number {
  // The API returns either an epoch timestamp in milliseconds or an ISO date.
  return /^\d+$/.test(expiresAt) ? Number(expiresAt) : Date.parse(expiresAt)
}
