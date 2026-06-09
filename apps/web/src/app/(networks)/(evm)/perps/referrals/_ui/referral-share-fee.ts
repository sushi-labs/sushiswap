const DEFAULT_REFERRAL_SHARE_FEE_PERCENT = 20

type ActiveFeeLevel = {
  level: number
  shareBps: number
}

export function getReferralShareFeePercent(
  activeFeeLevels: readonly ActiveFeeLevel[] | undefined,
): number {
  const levelOneFee = activeFeeLevels?.find(({ level }) => level === 1)

  if (!levelOneFee) {
    return DEFAULT_REFERRAL_SHARE_FEE_PERCENT
  }

  return levelOneFee.shareBps / 100
}
