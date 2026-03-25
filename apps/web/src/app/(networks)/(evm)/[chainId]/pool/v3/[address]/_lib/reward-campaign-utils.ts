import type { RewardCampaign } from 'src/lib/hooks/react-query'

export const KATANA_STAKER_WHITELIST_ADDRESS =
  '0xbe12e1b5c4859a3d141412748279b67458f729e9'

export function isKatanaStakeRequiredCampaign(
  campaign: RewardCampaign,
): boolean {
  return campaign.params.whitelist.some(
    (address) => address.toLowerCase() === KATANA_STAKER_WHITELIST_ADDRESS,
  )
}
