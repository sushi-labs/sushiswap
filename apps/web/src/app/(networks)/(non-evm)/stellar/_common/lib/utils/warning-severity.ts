/**
 * Warning severity utilities for price impact
 * Based on standard DeFi thresholds
 */

// Price impact thresholds (as percentages)
const ALLOWED_PRICE_IMPACT_LOW = 1 // 1%
const ALLOWED_PRICE_IMPACT_MEDIUM = 3 // 3%
const ALLOWED_PRICE_IMPACT_HIGH = 5 // 5%
const BLOCKED_PRICE_IMPACT_NON_EXPERT = 15 // 15%

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

export type WarningSeverity = 0 | 1 | 2 | 3 | 4

/**
 * Calculate warning severity based on price impact percentage
 * @param priceImpact - Price impact as a percentage (e.g., 2.5 for 2.5%)
 * @returns Severity level: 0 (none), 1 (low), 2-3 (medium), 4 (high/blocked)
 */
export function warningSeverity(
  priceImpact: number | undefined,
): WarningSeverity {
  if (!priceImpact || priceImpact === 0) return 0

  // Use absolute value to handle negative price impacts
  const absImpact = Math.abs(priceImpact)

  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity

  for (const impactLevel of IMPACT_TIERS) {
    if (absImpact >= impactLevel) return impact
    impact--
  }

  return 0
}

/**
 * Get CSS class name for warning severity
 * @param severity - Warning severity level
 * @returns CSS class name for text color
 */
export const warningSeverityClassName = (severity: WarningSeverity): string => {
  if (severity === 0 || severity === 1) return ''
  if (severity <= 3) return '!text-yellow'
  return '!text-red'
}

/**
 * Check if price impact requires user confirmation
 * @param priceImpact - Price impact as a percentage
 * @returns true if impact is >= 15% (requires confirmation)
 */
export function requiresPriceImpactConfirmation(
  priceImpact: number | undefined,
): boolean {
  if (!priceImpact) return false
  const absImpact = Math.abs(priceImpact)
  return absImpact >= BLOCKED_PRICE_IMPACT_NON_EXPERT
}
