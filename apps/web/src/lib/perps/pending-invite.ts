import type { EvmAddress } from 'sushi/evm'
import { normalizePerpsReferralCode } from './referral-code'

export const PENDING_PERPS_INVITE_KEY = 'sushi.perps.pending-invite'
export const PENDING_PERPS_INVITE_SELECTION_WINDOW_MS = 60 * 60 * 1000
export const PENDING_PERPS_INVITE_RETRY_COOLDOWN_MS = 60 * 1000

export type PendingPerpsInvite = {
  code: string
  createdAt: number
  primaryAddress?: EvmAddress
  eligibleAddresses: EvmAddress[]
  selectionWindowEndsAt?: number
  lastAttemptAt?: number
  lastAttemptAddress?: EvmAddress
}

export function createPendingPerpsInvite(code: string): PendingPerpsInvite {
  return {
    code: normalizePerpsReferralCode(code),
    createdAt: Date.now(),
    eligibleAddresses: [],
  }
}

export function bindPendingPerpsInviteToAddress(
  invite: PendingPerpsInvite,
  address: EvmAddress,
): PendingPerpsInvite {
  if (!invite.primaryAddress) {
    return {
      ...invite,
      primaryAddress: address,
      eligibleAddresses: [address],
      selectionWindowEndsAt:
        invite.createdAt + PENDING_PERPS_INVITE_SELECTION_WINDOW_MS,
    }
  }

  if (
    invite.selectionWindowEndsAt &&
    Date.now() <= invite.selectionWindowEndsAt &&
    !invite.eligibleAddresses.some(
      (candidate) => candidate.toLowerCase() === address.toLowerCase(),
    )
  ) {
    return {
      ...invite,
      eligibleAddresses: [...invite.eligibleAddresses, address],
    }
  }

  return invite
}

export function isAddressEligibleForPendingInvite(
  invite: PendingPerpsInvite,
  address: EvmAddress,
): boolean {
  return invite.eligibleAddresses.some(
    (candidate) => candidate.toLowerCase() === address.toLowerCase(),
  )
}

export function canRetryPendingInvite(invite: PendingPerpsInvite): boolean {
  if (!invite.lastAttemptAt) {
    return true
  }

  return (
    Date.now() - invite.lastAttemptAt >= PENDING_PERPS_INVITE_RETRY_COOLDOWN_MS
  )
}

export function markPendingInviteAttempt(
  invite: PendingPerpsInvite,
  address: EvmAddress,
): PendingPerpsInvite {
  return {
    ...invite,
    lastAttemptAt: Date.now(),
    lastAttemptAddress: address,
  }
}
