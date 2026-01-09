import { TIER_ICONS, type Tier } from 'src/lib/leaderboard/tiers'

export const TierIcon = ({
  tier,
  className,
}: {
  tier: Tier['icon']
  className?: string
}) => {
  return <div className={className}>{TIER_ICONS[tier]}</div>
}
