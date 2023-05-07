'use client'

import React from 'react'
import { SwiperSlide } from 'swiper/react'

import { CardNavigation } from '../CardNavigation'
import { EventItemCard } from '../EventItemCard'

const events = [
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'San Francisco, USA',
  },
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'Online',
  },
  {
    img: '',
    title: 'Breakfast in Bogota with your Crypto BFF’s',
    date: 'Feb 16,2022', // TODO: format
    location: 'San Francisco, USA',
  },
]

export function UpcomingEvents() {
  return (
    <section className="space-y-8">
      <h2 className="flex justify-center text-2xl font-bold text-slate-200">Upcoming Events</h2>
      <CardNavigation slidesPerView={3} spaceBetween={24} itemCount={events.length}>
        {events.map((event, index) => (
          <SwiperSlide key={index}>
            <EventItemCard {...event} />
          </SwiperSlide>
        ))}
      </CardNavigation>
    </section>
  )
}
