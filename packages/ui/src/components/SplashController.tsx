'use client'

import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import React, { FC, ReactNode } from 'react'

import { SushiIcon } from './icons'

const Component: FC<{ children: ReactNode; show?: boolean }> = ({ children, show = false }) => {
  return (
    <>
      {show ? (
        <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[1080] flex items-center justify-center">
          <Transition
            appear
            show={true}
            static
            enter="ease-in-out duration-1000"
            enterFrom="scale-1 saturate-0"
            enterTo="scale-[0.75] saturate-100"
            leave="ease-in-out duration-1000"
            leaveFrom="scale-[0.75]"
            leaveTo="scale-1"
          >
            <SushiIcon width={112} height={112} />
          </Transition>
        </div>
      ) : (
        children
      )}
    </>
  )
}

export const SplashController = dynamic(() => Promise.resolve(Component), {
  ssr: false,
})
