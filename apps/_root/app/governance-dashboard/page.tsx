import React from 'react'

import { HolderSnapshot, LatestPosts, UpcomingEvents } from './components'
import { getLatestGovernanceItems } from './lib'

export default async function Overview({ searchParams }) {
  const latestPosts = (await getLatestGovernanceItems(searchParams)) ?? []

  return (
    <div className="space-y-20">
      <LatestPosts posts={latestPosts} />
      {/* @ts-expect-error Async Server Component */}
      <HolderSnapshot />
      <UpcomingEvents />
    </div>
  )
}
