import React, { FC, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Transition } from '@headlessui/react'
import dynamic from 'next/dynamic'
import { PepeIcon } from '../../icons/PepeIcon'

const Component: FC<{ children: ReactNode; show?: boolean }> = ({ children, show = false }) => {
  const { isReady } = useRouter()

  return (
    <>
      {!isReady || show ? (
        <div className="fixed inset-0 bg-gray-100 dark:bg-slate-900 z-[1080] flex items-center justify-center">
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
            <PepeIcon width={256} height={256} className="sm:mr-2" />
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
