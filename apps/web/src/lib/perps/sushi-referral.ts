import type { EvmAddress } from 'sushi/evm'
import { normalizePerpsReferralCode } from './referral-code'

const MAX_REFERRAL_SIGNATURE_WINDOW_MS = 5 * 60 * 1000

export const sushiReferralQueryKeys = {
  overview: (address: EvmAddress | undefined) =>
    ['sushiReferralOverview', address] as const,
  history: (
    address: EvmAddress | undefined,
    from: string | undefined,
    to: string | undefined,
  ) => ['sushiReferralFeeHistory', address, from, to] as const,
  referees: (address: EvmAddress | undefined, pageSize = 50) =>
    ['sushiReferredUsers', address, pageSize] as const,
  claim: (address: EvmAddress | undefined) => ['perpsClaim', address] as const,
  create: (address: EvmAddress | undefined) =>
    ['useCreateSushiReferralCode', address] as const,
}

export function extractGraphQLErrorMessage(
  message: string | undefined,
): string {
  if (!message) {
    return 'Something went wrong'
  }

  try {
    const jsonStart = message.indexOf('{')
    const parsed = JSON.parse(message.slice(jsonStart))

    return parsed?.response?.errors?.[0]?.message ?? message
  } catch {
    return message
  }
}

export function buildSushiReferralRedemptionMessage({
  address,
  code,
  expiresAt,
}: {
  address: EvmAddress
  code: string
  expiresAt: string
}): string {
  const normalizedAddress = address.toLowerCase() as EvmAddress

  return [
    'Sushi Perps Referral Redemption',
    '',
    `Wallet: ${normalizedAddress}`,
    `Code: ${normalizePerpsReferralCode(code)}`,
    `Expires At: ${expiresAt}`,
  ].join('\n')
}

export function getSushiReferralRedemptionExpiry(): string {
  return new Date(Date.now() + MAX_REFERRAL_SIGNATURE_WINDOW_MS).toISOString()
}
