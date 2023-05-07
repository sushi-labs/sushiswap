import React from 'react'

import { HolderSnapshot } from '../HolderSnapshot'
import { LatestPosts } from './LatestPosts'
import { UpcomingEvents } from './UpcomingEvents'
import { getLatestGovernanceItems } from '../../lib'

export async function Overview() {
  // TODO: combine into array or make object
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
