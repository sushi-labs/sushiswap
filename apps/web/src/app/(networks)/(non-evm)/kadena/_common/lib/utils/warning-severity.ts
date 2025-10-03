import sharedConfig from '@sushiswap/tailwindcss-config'

type WarningSeverity = 0 | 1 | 2 | 3 | 4
export function warningSeverity(
  priceImpactPercentage: number | undefined,
): WarningSeverity {
  if (!priceImpactPercentage) return 0
  if (priceImpactPercentage < 1) return 0
  if (priceImpactPercentage < 3) return 1
  if (priceImpactPercentage < 5) return 2
  if (priceImpactPercentage < 15) return 3
  return 4
}

export const warningSeverityClassName = (severity: WarningSeverity): string => {
  if (severity === 0 || severity === 1) return ''
  if (severity <= 2) return sharedConfig.theme.extend.colors.yellow.DEFAULT
  return sharedConfig.theme.extend.colors.red.DEFAULT
}
