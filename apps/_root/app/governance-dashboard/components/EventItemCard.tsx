'use client'

import { LocationMarkerIcon } from '@heroicons/react/solid'
import { CalendarIcon } from '@sushiswap/ui'
import React from 'react'

interface Event {
  img: string
  title: string
  date: string
  location: string
}

export function EventItemCard(props: Event) {
  const { title, date, location } = props
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-800/60">
      <div className="h-[160px] w-full bg-slate-200"></div>
      <div className="space-y-8 p-4">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <footer className="flex justify-between text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarIcon width={14} height={14} />
            {date}
          </div>
          <div className="flex items-center gap-1">
            <LocationMarkerIcon width={14} height={14} />
            {location}
          </div>
        </footer>
      </div>
    </div>
  )
}
