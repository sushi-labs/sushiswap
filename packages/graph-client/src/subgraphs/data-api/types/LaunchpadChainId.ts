// This file is synchronized with the data-api launchpad allowlist.
export const LaunchpadChainIds = [4663] as const
export type LaunchpadChainId = (typeof LaunchpadChainIds)[number]

export function isLaunchpadChainId(value: number): value is LaunchpadChainId {
  return LaunchpadChainIds.includes(value as LaunchpadChainId)
}
