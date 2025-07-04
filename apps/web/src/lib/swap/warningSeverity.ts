import { Percent } from 'sushi'

const BIPS_BASE = 10000n

// used for warning states
const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent({
  numerator: 100,
  denominator: BIPS_BASE,
}) // 1%
const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent({
  numerator: 300,
  denominator: BIPS_BASE,
}) // 3%
const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent({
  numerator: 500,
  denominator: BIPS_BASE,
}) // 5%
const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent({
  numerator: 1500,
  denominator: BIPS_BASE,
}) // 15%

const IMPACT_TIERS = [
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  ALLOWED_PRICE_IMPACT_LOW,
]

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(
  priceImpact: Percent | undefined,
): WarningSeverity {
  if (!priceImpact) return 0
  let impact: WarningSeverity = IMPACT_TIERS.length as WarningSeverity
  for (const impactLevel of IMPACT_TIERS) {
    if (impactLevel.lt(priceImpact)) return impact
    impact--
  }
  return 0
}

export const warningSeverityClassName = (severity: WarningSeverity) => {
  if (severity === 0 || severity === 1) return ''
  if (severity <= 3) return '!text-yellow'
  return '!text-red'
}
