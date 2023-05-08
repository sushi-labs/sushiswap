import React from 'react'

import { HolderSnapshot, LatestPosts, UpcomingEvents } from './components'
import { getLatestGovernanceItems } from './lib'

export async function Overview() {
  const latestPosts = (await getLatestGovernanceItems()) ?? []

  return (
    <div className="space-y-20">
      <LatestPosts posts={latestPosts} />
      {/* @ts-expect-error Async Server Component */}
      <HolderSnapshot />
      <UpcomingEvents />
    </div>
  )
}
