'use client'

import { Transition } from '@headlessui/react'
import { SushiIcon } from '@sushiswap/ui'
import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[1080] flex items-center justify-center">
      <Transition
        appear
        show={true}
        unmount={false}
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
