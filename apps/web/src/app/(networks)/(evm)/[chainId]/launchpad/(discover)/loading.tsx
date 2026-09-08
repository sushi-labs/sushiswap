'use client'

import { LaunchpadExploreControlsSkeleton } from '../_ui/launchpad-explore-controls'
import { LaunchpadExploreSection } from '../_ui/launchpad-explore-section'
import { LaunchpadHero } from '../_ui/launchpad-hero'
import { TokenGridSkeleton } from '../_ui/token-grid'
import { TrendingTokensSkeleton } from '../_ui/trending-tokens'

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
