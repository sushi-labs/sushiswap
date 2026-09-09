'use client'

import { LaunchpadExploreControlsSkeleton } from '../_ui/explore/launchpad-explore-controls'
import { LaunchpadExploreSection } from '../_ui/explore/launchpad-explore-section'
import { LaunchpadHero } from '../_ui/home/launchpad-hero'
import { TokenGridSkeleton } from '../_ui/token-list/token-grid'
import { TrendingTokensSkeleton } from '../_ui/trending/trending-tokens'

export default function LaunchpadLoading(): React.ReactElement {
  return (
    <div aria-label="Loading launches" aria-busy="true">
      <LaunchpadHero isLoading trending={<TrendingTokensSkeleton />} />
      <LaunchpadExploreSection controls={<LaunchpadExploreControlsSkeleton />}>
        <TokenGridSkeleton />
      </LaunchpadExploreSection>
    </div>
  )
}
