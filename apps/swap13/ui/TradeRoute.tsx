'use client'

import { Transition } from '@headlessui/react'
import { FC } from 'react'
import { useTrade } from '../lib/useTrade'

export const TradeRoute: FC = () => {
  const { data: trade } = useTrade()

  return (
    <Transition
      show={!!trade?.route}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="w-full px-3 flex flex-col gap-1">
        {trade?.route.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    </Transition>
  )
}
