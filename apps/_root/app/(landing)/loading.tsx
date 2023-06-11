'use client'

import React from 'react'
import { Transition } from '@headlessui/react'
import { SushiIcon } from '@sushiswap/ui'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1080] bg-black flex items-center justify-center">
      <Transition
        appear
        show={true}
        unmount={false}
        static
        enter="ease-in-out duration-[1000ms]"
        enterFrom="scale-1 saturate-0"
        enterTo="scale-[0.75] saturate-100"
        leave="ease-in-out duration-[1000ms]"
        leaveFrom="scale-[0.75]"
        leaveTo="scale-1"
      >
        <SushiIcon width={256} height={256} className="sm:mr-2" />
      </Transition>
    </div>
  )
}
