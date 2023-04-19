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
    <div className="rounded-2xl bg-slate-800/60 overflow-hidden">
      <div className="w-full h-[160px] bg-slate-200"></div>
      <div className="p-4 space-y-8">
        <h3 className="text-slate-200 font-semibold">{title}</h3>
        <footer className="flex text-slate-300 justify-between text-sm font-medium">
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
