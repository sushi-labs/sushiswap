'use client'

import React from 'react'
import { SwiperSlide } from 'swiper/react'

import { SushiEvent } from '../../lib'
import { CardNavigation } from '../CardNavigation'
import { EventItemCard } from '../EventItemCard'

export function UpcomingEvents({ events }: { events: SushiEvent[] }) {
  return (
    <section className="space-y-8">
      <h2 className="flex justify-center text-2xl font-bold text-slate-200">Upcoming Events</h2>
      <CardNavigation slidesPerView={Math.min(events.length + 1, 3)} spaceBetween={24} itemCount={events.length}>
        {events.map((event, index) => (
          <SwiperSlide key={index}>
            <EventItemCard {...event} />
          </SwiperSlide>
        ))}
      </CardNavigation>
    </section>
  )
}
