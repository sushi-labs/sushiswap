import React from 'react'

import { HolderSnapshot, LatestPosts, UpcomingEvents } from './components'
import { getNotionEvents, getLatestGovernanceItems } from './lib'

export default async function Overview({ searchParams }) {
  const [latestPosts, events] = await Promise.all([getLatestGovernanceItems(searchParams), getNotionEvents()])

  return (
    <div className="space-y-12 md:space-y-20">
      <LatestPosts posts={latestPosts} />
      {/* @ts-expect-error Async Server Component */}
      <HolderSnapshot />
      <UpcomingEvents events={events} />
    </div>
  )
}
