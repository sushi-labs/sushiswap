import { type EvmAddress, EvmChainId } from 'sushi/evm'
import { parseAbi } from 'viem'

/**
 * Spraay Protocol batch distribution contract on Base.
 *
 * Enables push-model token distribution: send to up to 200 recipients in a
 * single transaction. The protocol fee is charged on top of the distributed
 * amount and is owner-configurable (currently 30 bps, capped at 500 bps), so
 * callers should read `calculateTotalCost` on-chain before sending.
 *
 * Verified on Sourcify (exact match) and BaseScan.
 * @see https://basescan.org/address/0x1646452F98E36A3c9Cfc3eDD8868221E207B5eEC#code
 */
export const SPRAAY_CHAIN_ID = EvmChainId.BASE

export const SPRAAY_BASE_ADDRESS: EvmAddress =
  '0x1646452F98E36A3c9Cfc3eDD8868221E207B5eEC'

export const SPRAAY_BATCH_ABI = parseAbi([
  'function sprayETH((address recipient, uint256 amount)[] recipients) payable',
  'function sprayToken(address token, (address recipient, uint256 amount)[] recipients)',
  'function sprayEqual(address token, address[] recipients, uint256 amountPerRecipient) payable',
  'function calculateFee(uint256 amount) view returns (uint256)',
  'function calculateTotalCost(uint256 totalAmount) view returns (uint256)',
  'function feeBps() view returns (uint256)',
  'function feeRecipient() view returns (address)',
  'function paused() view returns (bool)',
  'function MAX_FEE_BPS() view returns (uint256)',
  'function MAX_RECIPIENTS() view returns (uint256)',
  'function owner() view returns (address)',
])

/** Maximum number of recipients per batch call (`MAX_RECIPIENTS`). */
export const SPRAAY_MAX_RECIPIENTS = 200

/** Upper bound on the protocol fee in basis points (`MAX_FEE_BPS`). */
export const SPRAAY_MAX_FEE_BPS = 500

/** Sentinel token address for native ETH in `sprayEqual`. */
export const SPRAAY_NATIVE_SENTINEL: EvmAddress =
  '0x0000000000000000000000000000000000000000'

export interface SpraayRecipient {
  recipient: EvmAddress
  amount: bigint
}

/**
 * Sum the amounts sent to recipients, excluding the protocol fee.
 */
export function getSpraayDistributionAmount(
  recipients: readonly SpraayRecipient[],
): bigint {
  return recipients.reduce((sum, { amount }) => sum + amount, 0n)
}

/**
 * Validate a recipient list against the contract's on-chain requirements.
 * Returns an error message, or `null` if the list is valid.
 */
export function validateSpraayRecipients(
  recipients: readonly SpraayRecipient[],
): string | null {
  if (recipients.length === 0) return 'No recipients provided'
  if (recipients.length > SPRAAY_MAX_RECIPIENTS)
    return `Maximum ${SPRAAY_MAX_RECIPIENTS} recipients per batch`
  for (const { recipient, amount } of recipients) {
    if (recipient === SPRAAY_NATIVE_SENTINEL) return 'Invalid recipient'
    if (amount <= 0n) return 'Recipient amounts must be greater than zero'
  }
  return null
}

/**
 * Mirror of the contract's fee calculation: `amount * feeBps / 10000`.
 */
export function calculateSpraayFee(amount: bigint, feeBps: bigint): bigint {
  return (amount * feeBps) / 10000n
}
